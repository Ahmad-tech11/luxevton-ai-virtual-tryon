const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// ─── Fashn.ai Configuration ─────────────────────────────────────
const FASHN_API_KEY = process.env.FASHN_API_KEY;
const FASHN_BASE_URL = 'https://api.fashn.ai/v1';
const POLL_INTERVAL_MS = 3000;   // check status every 3 seconds
const MAX_POLL_TIME_MS = 180000; // 3-minute hard timeout

// ─── Helper: convert a local file to a base64 data-URI ─────────
function fileToBase64(filePath) {
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase().replace('.', '');
  const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
  return `data:${mime};base64,${buffer.toString('base64')}`;
}

// ─── Helper: download a URL to a local temp file ────────────────
async function downloadToTmp(url) {
  const ext = path.extname(new URL(url).pathname) || '.jpg';
  const tmpPath = path.join(require('os').tmpdir(), `garment-${Date.now()}${ext}`);
  const resp = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
  fs.writeFileSync(tmpPath, resp.data);
  return tmpPath;
}

// ─── Fashn.ai Try-On (tryon-max model) ──────────────────────────
// 1.  POST /v1/run  → get prediction ID
// 2.  Poll GET /v1/status/{id} until "completed" or "failed"
// 3.  Download the output CDN image and return as Buffer
async function fashnTryOn(modelImageBase64, productImageBase64) {
  // ── Step 1: Submit the try-on request ──
  const runResponse = await axios.post(
    `${FASHN_BASE_URL}/run`,
    {
      model_name: 'tryon-max',
      inputs: {
        model_image: modelImageBase64,
        product_image: productImageBase64,
      },
      resolution: '1k',
      output_format: 'jpeg',
      num_images: 1,
      seed: 42,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${FASHN_API_KEY}`,
      },
      timeout: 30000,
    }
  );

  const predictionId = runResponse.data.id;
  if (!predictionId) {
    throw new Error(runResponse.data.error || 'No prediction ID returned from Fashn.ai');
  }
  logger.info(`[Fashn.ai] Prediction submitted — ID: ${predictionId}`);

  // ── Step 2: Poll for status ──
  const startTime = Date.now();

  while (Date.now() - startTime < MAX_POLL_TIME_MS) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

    const statusResponse = await axios.get(
      `${FASHN_BASE_URL}/status/${predictionId}`,
      {
        headers: { Authorization: `Bearer ${FASHN_API_KEY}` },
        timeout: 15000,
      }
    );

    const { status, output, error } = statusResponse.data;
    const creditsUsed = statusResponse.headers['x-fashn-credits-used'];

    if (status === 'completed') {
      logger.info(
        `[Fashn.ai] ✅ Completed in ${Math.round((Date.now() - startTime) / 1000)}s — Credits used: ${creditsUsed || 'N/A'}`
      );

      if (output && output.length > 0) {
        // Download the CDN image
        const imageResp = await axios.get(output[0], {
          responseType: 'arraybuffer',
          timeout: 30000,
        });
        return Buffer.from(imageResp.data);
      }
      throw new Error('Prediction completed but no output image received.');
    }

    if (status === 'failed') {
      const errMsg = error?.message || error?.name || 'Unknown generation error';
      throw new Error(`Fashn.ai prediction failed: ${errMsg}`);
    }

    // Still processing — log and continue polling
    logger.info(
      `[Fashn.ai] Status: ${status} (${Math.round((Date.now() - startTime) / 1000)}s elapsed)`
    );
  }

  throw new Error(`Fashn.ai prediction timed out after ${MAX_POLL_TIME_MS / 1000}s`);
}

// ─── Main Controller ────────────────────────────────────────────
exports.processTryOn = async (req, res) => {
  let userImagePath = null;
  let garmentTmpPath = null;

  try {
    // ── Validate API key ──
    if (!FASHN_API_KEY) {
      return res.status(500).json({
        success: false,
        message:
          'Fashn.ai API key is not configured. Please add FASHN_API_KEY to your .env file.',
      });
    }

    // ── Validate user image ──
    if (!req.files || !req.files.userImage || !req.files.userImage[0]) {
      return res
        .status(400)
        .json({ success: false, message: 'Please upload your photo.' });
    }
    userImagePath = req.files.userImage[0].path;

    // Convert user photo to base64 for Fashn.ai
    const modelImageBase64 = fileToBase64(userImagePath);

    // ── Resolve garment image → base64 ──
    let productImageBase64;

    if (req.files?.garmentImage?.[0]) {
      // Garment uploaded as file
      productImageBase64 = fileToBase64(req.files.garmentImage[0].path);
    } else if (req.body.garmentImageUrl) {
      const url = req.body.garmentImageUrl;

      if (url.startsWith('/')) {
        // Local asset path — resolve to disk
        let garmentPath;
        if (url.startsWith('/uploads/')) {
          garmentPath = path.join(
            __dirname,
            '../../uploads',
            url.replace('/uploads/', '')
          );
        } else {
          // Try client/public first, then client/dist
          const publicPath = path.join(
            __dirname,
            '../../../client/public',
            url
          );
          const distPath = path.join(__dirname, '../../../client/dist', url);

          if (fs.existsSync(publicPath)) garmentPath = publicPath;
          else if (fs.existsSync(distPath)) garmentPath = distPath;
          else
            return res.status(400).json({
              success: false,
              message: 'Garment image not found locally.',
            });
        }
        productImageBase64 = fileToBase64(garmentPath);
      } else if (url.startsWith('http')) {
        // External URL — download first, then convert
        garmentTmpPath = await downloadToTmp(url);
        productImageBase64 = fileToBase64(garmentTmpPath);
      } else {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid garment image URL.' });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide a garment image.' });
    }

    const category = req.body.category || 'upper body garment';
    logger.info(`[Fashn.ai] Starting try-on — Category: ${category}`);

    // ── Call Fashn.ai ──
    const outputBuffer = await fashnTryOn(modelImageBase64, productImageBase64);

    if (!outputBuffer) {
      throw new Error('No image generated.');
    }

    // ── Save result ──
    const fileName = `tryon-${Date.now()}.jpg`;
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir))
      fs.mkdirSync(uploadsDir, { recursive: true });
    fs.writeFileSync(path.join(uploadsDir, fileName), outputBuffer);

    cleanup(userImagePath, garmentTmpPath, req);
    logger.info(`[Fashn.ai] ✅ Image saved → /uploads/${fileName}`);
    return res.json({ success: true, imageUrl: `/uploads/${fileName}` });
  } catch (error) {
    cleanup(userImagePath, garmentTmpPath, req);
    logger.error('[Fashn.ai] Error:', error.message || error);

    const msg = error.message || '';
    const axiosStatus = error.response?.status;

    // ── Specific error responses ──
    if (axiosStatus === 401 || msg.includes('Unauthorized') || msg.includes('Invalid token')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Fashn.ai API key. Please check FASHN_API_KEY in your .env file.',
        error: msg,
      });
    }

    if (axiosStatus === 402 || msg.includes('InsufficientCredits') || msg.includes('credits')) {
      return res.status(402).json({
        success: false,
        message: 'Insufficient Fashn.ai credits. Purchase more at app.fashn.ai.',
        error: msg,
      });
    }

    if (msg.includes('timed out')) {
      return res.status(504).json({
        success: false,
        message: 'The try-on request timed out. Please try again.',
        error: msg,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Something went wrong while processing your try-on. Please try again.',
      error: msg,
    });
  }
};

// ─── Cleanup helper ─────────────────────────────────────────────
function cleanup(userImagePath, garmentTmpPath, req) {
  try {
    if (userImagePath && fs.existsSync(userImagePath))
      fs.unlinkSync(userImagePath);
    if (garmentTmpPath && fs.existsSync(garmentTmpPath))
      fs.unlinkSync(garmentTmpPath);
    if (
      req.files?.garmentImage?.[0]?.path &&
      fs.existsSync(req.files.garmentImage[0].path)
    ) {
      fs.unlinkSync(req.files.garmentImage[0].path);
    }
  } catch (e) {
    /* ignore cleanup errors */
  }
}
