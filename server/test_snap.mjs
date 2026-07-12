import { client, handle_file } from '@gradio/client';

async function testSnapwear() {
  console.log("Testing SnapwearAI/Snapwear-Virtual-Try-On...");
  try {
    const app = await client("SnapwearAI/Snapwear-Virtual-Try-On", {});
    
    // Inputs: imageeditor(Person), image(Garment), slider(Seed), checkbox(Random seed)
    console.log("Submitting prediction...");
    const result = await app.predict('/call_backend_with_retry', [
      { background: handle_file('user.jpg'), layers: [], composite: null },
      handle_file('garment.jpg'),
      42,
      true
    ]);
    console.log("SUCCESS! Result:", JSON.stringify(result.data).substring(0, 500));
  } catch(e) {
    console.log("SnapwearAI Failed:", e.message.substring(0, 300));
  }
}

testSnapwear();
