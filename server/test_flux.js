const { HfInference } = require('@huggingface/inference');
const sharp = require('sharp');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

async function test() {
  try {
    const userImagePath = "user.jpg";
    const garmentPath = "garment.jpg";
    
    // Make sure we have test images
    if (!fs.existsSync(userImagePath) || !fs.existsSync(garmentPath)) {
        console.log("Images missing, downloading...");
        const axios = require('axios');
        const uResp = await axios.get('https://picsum.photos/400/600', { responseType: 'arraybuffer' });
        fs.writeFileSync(userImagePath, uResp.data);
        const gResp = await axios.get('https://picsum.photos/200/300', { responseType: 'arraybuffer' });
        fs.writeFileSync(garmentPath, gResp.data);
    }

    const userMetadata = await sharp(userImagePath).metadata();
    const targetGarmentWidth = Math.floor(userMetadata.width * 0.5);
    
    const garmentBuffer = await sharp(garmentPath)
      .resize({ width: targetGarmentWidth })
      .toBuffer();
    
    const compositeBuffer = await sharp(userImagePath)
      .composite([{ input: garmentBuffer, gravity: 'center' }])
      .jpeg({ quality: 90 })
      .toBuffer();

    const hf = new HfInference(process.env.TRYON_HF_TOKEN);
    const blob = new Blob([compositeBuffer], { type: "image/jpeg" });
    
    console.log("Calling FLUX Inference API...");
    const resultBlob = await hf.imageToImage({
      model: "ovi054/virtual-tryon-kontext-lora",
      inputs: blob,
      parameters: {
        prompt: "wear it, photorealistic",
        strength: 0.85,
      }
    });

    console.log("Success! Blob size:", resultBlob.size);
  } catch (err) {
    console.error("FLUX Failed:", err.message);
  }
}

test();
