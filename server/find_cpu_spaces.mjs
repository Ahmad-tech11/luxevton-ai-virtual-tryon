import { client, handle_file } from '@gradio/client';
import axios from 'axios';

// Let's find ALL spaces with "try-on" that have CPU hardware (no ZeroGPU quota!)
async function findCPUSpaces() {
  const terms = ['try-on', 'tryon', 'virtual-try', 'clothing-swap', 'outfit'];
  const tested = new Set();
  const working = [];
  
  for (const term of terms) {
    try {
      const res = await axios.get(`https://huggingface.co/api/spaces?search=${term}&limit=50&sort=likes`);
      for (const space of res.data) {
        if (tested.has(space.id)) continue;
        tested.add(space.id);
        
        const hw = space.runtime?.hardware?.current || 'unknown';
        // Only care about non-ZeroGPU spaces
        if (hw === 'cpu-basic' || hw === 'cpu-upgrade' || hw.includes('t4') || hw.includes('a10')) {
          try {
            const app = await client(space.id, {});
            const endpoints = app.config.dependencies
              .filter(d => d.api_name && !d.api_name.startsWith('load_example') && !d.api_name.startsWith('_'))
              .map(d => {
                const inputs = d.inputs.map(id => {
                  const c = app.config.components.find(x => x.id === id);
                  return c?.type;
                });
                return { name: d.api_name, inputs };
              })
              .filter(e => e.inputs.some(i => i === 'image' || i === 'imageeditor'));
            
            if (endpoints.length > 0) {
              console.log(`✅ ${space.id} | HW: ${hw} | ${JSON.stringify(endpoints.map(e => e.name))}`);
              working.push({ id: space.id, hw, endpoints });
            }
          } catch(e) {
            // skip
          }
        }
      }
    } catch(e) {}
  }
  
  console.log("\n=== SUMMARY: Working non-ZeroGPU spaces ===");
  console.log(JSON.stringify(working, null, 2));
}

findCPUSpaces();
