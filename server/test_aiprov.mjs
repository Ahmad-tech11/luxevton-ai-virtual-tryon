import { client, handle_file } from '@gradio/client';

async function testAiprovider() {
  console.log("=== Testing aiprovider25 (CPU-based, no ZeroGPU!) ===");
  try {
    const app = await client("aiprovider25/virtual-outfit-try-on-api-demo", {});
    const dep = app.config.dependencies.find(d => d.api_name === "process_tryon");
    const inputs = dep.inputs.map(id => {
      const c = app.config.components.find(x => x.id === id);
      return { id: c?.id, type: c?.type, label: c?.props?.label, choices: c?.props?.choices, value: c?.props?.value };
    });
    console.log("Inputs:", JSON.stringify(inputs, null, 2));
    
    console.log("\nTesting prediction...");
    const result = await app.predict('/process_tryon', [
      handle_file('user.jpg'),
      handle_file('garment.jpg'),
    ]);
    console.log("SUCCESS! Result:", JSON.stringify(result.data).substring(0, 500));
  } catch(e) {
    console.log("Failed:", e.message);
  }
}

testAiprovider();
