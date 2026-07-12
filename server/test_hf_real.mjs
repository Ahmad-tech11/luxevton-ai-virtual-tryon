import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import axios from 'axios';
import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';
dotenv.config();

const HF_TOKEN = process.env.TRYON_HF_TOKEN;
const hf = new HfInference(HF_TOKEN);
const MODEL_ID = 'ovi054/virtual-tryon-kontext-lora';

async function run() {
    try {
        console.log("Downloading a valid user image...");
        const userResp = await axios.get('https://picsum.photos/400/600', { responseType: 'arraybuffer' });
        fs.writeFileSync('user.jpg', userResp.data);

        console.log("Downloading a valid garment image...");
        const garmentResp = await axios.get('https://picsum.photos/200/300', { responseType: 'arraybuffer' });
        fs.writeFileSync('garment.jpg', garmentResp.data);

        console.log("Creating composite...");
        const userMetadata = await sharp('user.jpg').metadata();
        const targetGarmentWidth = Math.floor(userMetadata.width * 0.5);
        
        const garmentBuffer = await sharp('garment.jpg')
            .resize({ width: targetGarmentWidth })
            .toBuffer();
        
        const compositeBuffer = await sharp('user.jpg')
            .composite([{
                input: garmentBuffer,
                gravity: 'center'
            }])
            .jpeg({ quality: 90 })
            .toBuffer();
            
        fs.writeFileSync('composite.jpg', compositeBuffer);
        console.log("Composite created, calling HF...");

        const blob = new Blob([compositeBuffer], { type: "image/jpeg" });

        const resultBlob = await hf.imageToImage({
            model: MODEL_ID,
            inputs: blob,
            parameters: {
                prompt: "wear it, photorealistic, high quality, realistic human wearing a shirt, highly detailed",
                strength: 0.85,
                num_inference_steps: 30,
                guidance_scale: 7.5
            }
        });

        console.log("Success!", resultBlob.size);
    } catch (e) {
        console.error("Error encountered:");
        console.error(e.message || e);
    }
}

run();
