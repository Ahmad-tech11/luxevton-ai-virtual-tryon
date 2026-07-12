import { client, handle_file } from '@gradio/client';
import fs from 'fs';

async function inspectTexelmoda() {
  console.log("Inspecting texelmoda...");
  const app = await client("texelmoda/virtual-try-on-diffusion-vton-d", {});
  const allDeps = app.config.dependencies.filter(d => d.api_name);
  
  for (const dep of allDeps) {
    const inputs = dep.inputs.map(id => {
      const c = app.config.components.find(x => x.id === id);
      return { type: c?.type, label: c?.props?.label, choices: c?.props?.choices };
    });
    const outputs = dep.outputs.map(id => {
      const c = app.config.components.find(x => x.id === id);
      return { type: c?.type, label: c?.props?.label };
    });
    console.log(`\nEndpoint: ${dep.api_name}`);
    console.log("  Inputs:", JSON.stringify(inputs));
    console.log("  Outputs:", JSON.stringify(outputs));
  }
}

inspectTexelmoda().catch(console.error);
