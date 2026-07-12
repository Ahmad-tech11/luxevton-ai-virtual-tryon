import { client, handle_file } from '@gradio/client';
import axios from 'axios';

async function testTexelmoda() {
  console.log("=== Checking texelmoda/virtual-try-on-diffusion-vton-d ===");
  try {
    // Check hardware
    const meta = await axios.get('https://huggingface.co/api/spaces/texelmoda/virtual-try-on-diffusion-vton-d');
    console.log("Hardware:", JSON.stringify(meta.data.runtime?.hardware));
    
    const app = await client("texelmoda/virtual-try-on-diffusion-vton-d", {});
    const deps = app.config.dependencies.filter(d => d.api_name && !d.api_name.startsWith('load_example'));
    
    for (const dep of deps) {
      const inputs = dep.inputs.map(id => {
        const c = app.config.components.find(x => x.id === id);
        return { type: c?.type, label: c?.props?.label };
      });
      console.log(`Endpoint: ${dep.api_name}`, JSON.stringify(inputs));
    }
  } catch(e) {
    console.log("Failed:", e.message);
  }
}

async function testSnapwear() {
  console.log("\n=== Checking SnapwearAI/Snapwear-Virtual-Try-On ===");
  try {
    const meta = await axios.get('https://huggingface.co/api/spaces/SnapwearAI/Snapwear-Virtual-Try-On');
    console.log("Hardware:", JSON.stringify(meta.data.runtime?.hardware));
    
    const app = await client("SnapwearAI/Snapwear-Virtual-Try-On", {});
    const deps = app.config.dependencies.filter(d => d.api_name && !d.api_name.startsWith('load_example') && !d.api_name.startsWith('lambda'));
    
    for (const dep of deps) {
      const inputs = dep.inputs.map(id => {
        const c = app.config.components.find(x => x.id === id);
        return { type: c?.type, label: c?.props?.label };
      });
      console.log(`Endpoint: ${dep.api_name}`, JSON.stringify(inputs));
    }
  } catch(e) {
    console.log("Failed:", e.message);
  }
}

testTexelmoda().then(() => testSnapwear());
