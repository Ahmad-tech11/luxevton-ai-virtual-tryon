import { client, handle_file } from '@gradio/client';
import fs from 'fs';

async function inspectAndTest() {
  // ─── 1. Inspect Kolors duplicate ───
  console.log("=== Inspecting plucxyomg/Kolors-Virtual-Try-On ===");
  try {
    const app1 = await client("plucxyomg/Kolors-Virtual-Try-On", {});
    const dep1 = app1.config.dependencies.find(d => d.api_name === "tryon");
    const inputs1 = dep1.inputs.map(id => {
      const c = app1.config.components.find(x => x.id === id);
      return { type: c?.type, label: c?.props?.label, choices: c?.props?.choices };
    });
    console.log("Inputs:", JSON.stringify(inputs1, null, 2));

    console.log("\nTesting prediction...");
    const r1 = await app1.predict('/tryon', [
      handle_file('user.jpg'),
      handle_file('garment.jpg'),
    ]);
    console.log("SUCCESS! Result:", JSON.stringify(r1.data).substring(0, 300));
  } catch(e) {
    console.log("Failed:", e.message);
  }

  // ─── 2. Inspect mr-dee/virtual-try-on ───
  console.log("\n=== Inspecting mr-dee/virtual-try-on ===");
  try {
    const app2 = await client("mr-dee/virtual-try-on", {});
    const dep2 = app2.config.dependencies.find(d => d.api_name === "swap_clothing");
    const inputs2 = dep2.inputs.map(id => {
      const c = app2.config.components.find(x => x.id === id);
      return { type: c?.type, label: c?.props?.label, choices: c?.props?.choices };
    });
    console.log("Inputs:", JSON.stringify(inputs2, null, 2));

    console.log("\nTesting prediction...");
    const r2 = await app2.predict('/swap_clothing', [
      handle_file('user.jpg'),
      handle_file('garment.jpg'),
    ]);
    console.log("SUCCESS! Result:", JSON.stringify(r2.data).substring(0, 300));
  } catch(e) {
    console.log("Failed:", e.message);
  }

  // ─── 3. Inspect Miragic-AI ───
  console.log("\n=== Inspecting Miragic-AI/Miragic-Virtual-Try-On ===");
  try {
    const app3 = await client("Miragic-AI/Miragic-Virtual-Try-On", {});
    const dep3 = app3.config.dependencies.find(d => d.api_name === "virtual_tryon");
    const inputs3 = dep3.inputs.map(id => {
      const c = app3.config.components.find(x => x.id === id);
      return { type: c?.type, label: c?.props?.label, choices: c?.props?.choices };
    });
    console.log("Inputs:", JSON.stringify(inputs3, null, 2));
  } catch(e) {
    console.log("Failed:", e.message);
  }
}

inspectAndTest();
