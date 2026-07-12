import { client, handle_file } from '@gradio/client';

async function testFashn() {
  console.log("Testing fashn-ai/fashn-vton-1.5...");
  try {
    let app = await client("fashn-ai/fashn-vton-1.5", {});
    
    // API inputs from config:
    // 0: Person Image (image)
    // 1: Garment Image (image)
    // 2: Category dropdown: "tops" | "bottoms" | "one-pieces"
    // 3: Photo Type dropdown: "model" | "flat-lay"
    // 4: Sampling Steps slider: 10-50, default 50
    // 5: Guidance Scale slider: 1-3, default 1.5
    // 6: Seed number: default 42
    // 7: Segmentation Free checkbox: default true
    
    console.log("Submitting prediction...");
    const result = await app.predict('/try_on', [
      handle_file('user.jpg'), 
      handle_file('garment.jpg'),
      "tops",
      "flat-lay",
      30,
      1.5,
      42,
      true
    ]);
    console.log("SUCCESS! Result:", JSON.stringify(result.data).substring(0, 200));
  } catch(e) {
    console.log("Failed:", e.message);
  }
}
testFashn();
