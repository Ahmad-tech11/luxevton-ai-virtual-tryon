import { client, handle_file } from '@gradio/client';
import axios from 'axios';

// Search for ALL virtual try-on spaces and test each one
async function findWorkingSpace() {
  const searchTerms = ['virtual-try-on', 'VTON', 'try-on', 'tryon'];
  const tested = new Set();
  
  for (const term of searchTerms) {
    console.log(`\n--- Searching: ${term} ---`);
    try {
      const res = await axios.get(`https://huggingface.co/api/spaces?search=${term}&limit=30&sort=likes`);
      for (const space of res.data) {
        if (tested.has(space.id)) continue;
        tested.add(space.id);
        
        try {
          const app = await client(space.id, {});
          const endpoints = app.config.dependencies
            .filter(d => d.api_name && !d.api_name.startsWith('load_example') && !d.api_name.startsWith('lambda') && !d.api_name.startsWith('_'))
            .map(d => d.api_name);
          
          if (endpoints.length > 0) {
            // Check if it uses ZeroGPU by looking at runtime
            const runtimeRes = await axios.get(`https://huggingface.co/api/spaces/${space.id}`).catch(() => null);
            const hardware = runtimeRes?.data?.runtime?.hardware || 'unknown';
            const sdk = runtimeRes?.data?.sdk || 'unknown';
            
            console.log(`✅ ${space.id} | HW: ${hardware} | SDK: ${sdk} | Endpoints: ${endpoints.join(', ')}`);
          }
        } catch(e) {
          // skip dead spaces
        }
      }
    } catch(e) {
      console.log(`Search failed for ${term}`);
    }
  }
}

findWorkingSpace();
