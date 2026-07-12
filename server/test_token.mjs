import { client, handle_file } from '@gradio/client';
import dotenv from 'dotenv';
dotenv.config();

const TOKEN = process.env.TRYON_HF_TOKEN;

async function testWithToken() {
  const spaces = [
    'yisol/IDM-VTON',
    'ronniechoyy/IDM-VTON-20250428',
  ];
  
  for (const space of spaces) {
    console.log(`\n--- Testing ${space} WITH token ---`);
    try {
      const app = await client(space, { hf_token: TOKEN });
      const result = await app.predict('/tryon', [
        { background: handle_file('user.jpg'), layers: [], composite: null },
        handle_file('garment.jpg'),
        'upper body garment',
        true, false, 30, 42,
      ]);
      const output = result.data[0];
      console.log("SUCCESS! URL:", output?.url || JSON.stringify(output).substring(0, 200));
      return;
    } catch(e) {
      console.log("Failed:", e.message.substring(0, 200));
    }

    console.log(`\n--- Testing ${space} WITHOUT token ---`);
    try {
      const app = await client(space, {});
      const result = await app.predict('/tryon', [
        { background: handle_file('user.jpg'), layers: [], composite: null },
        handle_file('garment.jpg'),
        'upper body garment',
        true, false, 30, 42,
      ]);
      const output = result.data[0];
      console.log("SUCCESS! URL:", output?.url || JSON.stringify(output).substring(0, 200));
      return;
    } catch(e) {
      console.log("Failed:", e.message.substring(0, 200));
    }
  }
  
  console.log("\nAll spaces exhausted.");
}

testWithToken();
