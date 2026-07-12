import { client, handle_file } from '@gradio/client';
import dotenv from 'dotenv';
dotenv.config();

// The SnapwearAI uses Kolors-Virtual-Try-On backend (its own server, NOT ZeroGPU)
// But it needs time to start up.
// Let's try the Kolors space with the correct 4-input format

async function testKolors() {
  console.log("Testing plucxyomg/Kolors-Virtual-Try-On with 4 params...");
  try {
    // Inputs: Person image, Garment image, Seed slider, Random seed checkbox
    const app = await client("plucxyomg/Kolors-Virtual-Try-On", {});
    const result = await app.predict('/tryon', [
      handle_file('user.jpg'),
      handle_file('garment.jpg'),
      42,
      true
    ]);
    console.log("Kolors SUCCESS!", JSON.stringify(result.data).substring(0, 300));
  } catch(e) {
    console.log("Kolors Failed:", e.message.substring(0, 200));
  }
}

async function testSnapwear() {
  console.log("\nRetrying SnapwearAI...");
  try {
    const app = await client("SnapwearAI/Snapwear-Virtual-Try-On", {});
    const result = await app.predict('/call_backend_with_retry', [
      { background: handle_file('user.jpg'), layers: [], composite: null },
      handle_file('garment.jpg'),
      42,
      true
    ]);
    console.log("Snapwear Result:", JSON.stringify(result.data).substring(0, 500));
  } catch(e) {
    console.log("Snapwear Failed:", e.message.substring(0, 200));
  }
}

async function testIDMWithNewToken() {
  // The ZeroGPU quota is per HF account. If user makes a new account, they get fresh quota.
  // Let's test if connecting with a different approach helps
  console.log("\nTesting yisol/IDM-VTON with HF token (authenticated = more quota)...");
  try {
    const app = await client("yisol/IDM-VTON", { hf_token: process.env.TRYON_HF_TOKEN });
    const result = await app.predict('/tryon', [
      { background: handle_file('user.jpg'), layers: [], composite: null },
      handle_file('garment.jpg'),
      'upper body garment',
      true, false, 30, 42,
    ]);
    const output = result.data[0];
    console.log("IDM SUCCESS! URL:", output?.url || JSON.stringify(output).substring(0, 200));
  } catch(e) {
    console.log("IDM Failed:", e.message.substring(0, 200));
  }
}

testKolors().then(() => testSnapwear()).then(() => testIDMWithNewToken());
