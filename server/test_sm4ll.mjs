import { client, handle_file } from '@gradio/client';
import fs from 'fs';

async function testSm4ll() {
  console.log("Testing sm4ll-VTON/sm4ll-VTON-Demo...");
  try {
    const app = await client("sm4ll-VTON/sm4ll-VTON-Demo", {});
    
    // Inputs:
    // 0: Base Image (person photo)
    // 1: Product Image (garment)
    // 2: Model radio: "eyewear" | "footwear" | "dress" | "top"
    // 3: Mask Image (Optional) - null
    
    console.log("Submitting prediction...");
    const result = await app.predict('/generate', [
      handle_file('user.jpg'),
      handle_file('garment.jpg'),
      "top",
      null  // no mask
    ]);
    
    console.log("SUCCESS!");
    console.log("Result:", JSON.stringify(result.data).substring(0, 300));
  } catch(e) {
    console.log("Failed:", e.message);
  }
}

testSm4ll();
