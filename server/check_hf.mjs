import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const hf = new HfInference(process.env.TRYON_HF_TOKEN);

async function run() {
  try {
    console.log("Calling HF inference imageToImage...");
    const imageBuffer = fs.readFileSync("test.jpg");
    const blob = new Blob([imageBuffer], { type: "image/jpeg" });
    
    const result = await hf.imageToImage({
      model: "ovi054/virtual-tryon-kontext-lora",
      inputs: blob,
      parameters: {
        prompt: "wear it, a realistic human wearing the garment, high quality, photorealistic",
        strength: 0.85,
      }
    });
    console.log("Success! Returned a blob of size", result.size);
    fs.writeFileSync("output.jpg", Buffer.from(await result.arrayBuffer()));
    console.log("Saved output.jpg");
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
