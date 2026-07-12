import { client, handle_file } from '@gradio/client';
import sharp from 'sharp';
import fs from 'fs';

// SnapwearAI needs a mask layer. The imageeditor format expects:
// { background: image, layers: [mask_layer], composite: composited_image }
// The mask should be white where we want to replace (upper body area)

async function testWithMask() {
  console.log("Testing SnapwearAI with auto-generated mask...");
  
  // Read user image dimensions
  const userBuf = fs.readFileSync('user.jpg');
  const meta = await sharp(userBuf).metadata();
  const w = meta.width;
  const h = meta.height;
  
  // Create a simple mask: white rectangle covering upper body area (top 30% to 70% height, center 60% width)
  const maskSvg = `<svg width="${w}" height="${h}">
    <rect x="${Math.floor(w * 0.15)}" y="${Math.floor(h * 0.15)}" 
          width="${Math.floor(w * 0.7)}" height="${Math.floor(h * 0.55)}" 
          fill="white" rx="20"/>
  </svg>`;
  
  const maskBuffer = await sharp(Buffer.from(maskSvg))
    .resize(w, h)
    .png()
    .toBuffer();
  
  fs.writeFileSync('mask_test.png', maskBuffer);
  console.log("Mask created:", w, "x", h);

  // Create composite (user image with mask overlay)
  const compositeBuf = await sharp(userBuf)
    .composite([{ input: maskBuffer, blend: 'over' }])
    .png()
    .toBuffer();
  fs.writeFileSync('composite_test.png', compositeBuf);

  try {
    const app = await client("SnapwearAI/Snapwear-Virtual-Try-On", {});
    
    // imageeditor format with layers
    const result = await app.predict('/call_backend_with_retry', [
      { 
        background: handle_file('user.jpg'), 
        layers: [handle_file('mask_test.png')], 
        composite: handle_file('composite_test.png')
      },
      handle_file('garment.jpg'),
      42,
      true
    ]);
    console.log("Result:", JSON.stringify(result.data).substring(0, 500));
  } catch(e) {
    console.log("Failed:", e.message.substring(0, 300));
  }
}

testWithMask();
