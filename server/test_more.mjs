import { client, handle_file } from '@gradio/client';

async function testMiragic() {
  console.log("Testing Miragic-AI/Miragic-Virtual-Try-On...");
  try {
    const app = await client("Miragic-AI/Miragic-Virtual-Try-On", {});
    
    // Inputs: Person Image, Garment Image, Garment Type ("Dress/Suit"|"Top"|"Bottom")
    console.log("Submitting prediction...");
    const result = await app.predict('/virtual_tryon', [
      handle_file('user.jpg'),
      handle_file('garment.jpg'),
      "Top"
    ]);
    console.log("SUCCESS! Result:", JSON.stringify(result.data).substring(0, 500));
  } catch(e) {
    console.log("Miragic Failed:", e.message);
  }
}

async function testWeShop() {
  console.log("\nTesting WeShopAI/WeShopAI-Virtual-Try-On...");
  try {
    const app = await client("WeShopAI/WeShopAI-Virtual-Try-On", {});
    const dep = app.config.dependencies.find(d => d.api_name === "generate_image");
    const inputs = dep.inputs.map(id => {
      const c = app.config.components.find(x => x.id === id);
      return { type: c?.type, label: c?.props?.label, choices: c?.props?.choices, value: c?.props?.value };
    });
    console.log("WeShop Inputs:", JSON.stringify(inputs, null, 2));
  } catch(e) {
    console.log("WeShop Failed:", e.message);
  }
}

async function testKrsatyam() {
  console.log("\nTesting krsatyam7/Virtual_Clothing_Try-On...");
  try {
    const app = await client("krsatyam7/Virtual_Clothing_Try-On", {});
    const dep = app.config.dependencies.find(d => d.api_name === "swap_clothing");
    const inputs = dep.inputs.map(id => {
      const c = app.config.components.find(x => x.id === id);
      return { type: c?.type, label: c?.props?.label };
    });
    console.log("Inputs:", JSON.stringify(inputs));
    
    console.log("Submitting prediction...");
    const result = await app.predict('/swap_clothing', [
      handle_file('user.jpg'),
      handle_file('garment.jpg'),
    ]);
    console.log("SUCCESS! Result:", JSON.stringify(result.data).substring(0, 500));
  } catch(e) {
    console.log("krsatyam7 Failed:", e.message);
  }
}

async function main() {
  await testMiragic();
  await testWeShop();
  await testKrsatyam();
}
main();
