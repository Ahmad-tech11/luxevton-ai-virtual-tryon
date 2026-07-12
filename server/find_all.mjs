import { client, handle_file } from '@gradio/client';
import axios from 'axios';

// Find ALL spaces, include zero-gpu ones too, and show hardware
async function findALLSpaces() {
  const terms = ['try-on', 'tryon', 'virtual-try', 'clothing', 'outfit'];
  const tested = new Set();
  
  for (const term of terms) {
    try {
      const res = await axios.get(`https://huggingface.co/api/spaces?search=${term}&limit=50&sort=likes`);
      for (const space of res.data) {
        if (tested.has(space.id)) continue;
        tested.add(space.id);
        
        const hw = space.runtime?.hardware?.current || 'unknown';
        const stage = space.runtime?.stage || 'unknown';
        
        if (stage !== 'RUNNING') continue;
        
        try {
          const app = await client(space.id, {});
          const endpoints = app.config.dependencies
            .filter(d => d.api_name && !d.api_name.startsWith('load_example') && !d.api_name.startsWith('_') && !d.api_name.startsWith('lambda'))
            .map(d => d.api_name);
          
          if (endpoints.length > 0) {
            console.log(`${space.id} | HW: ${hw} | Stage: ${stage} | Endpoints: ${endpoints.join(', ')}`);
          }
        } catch(e) {}
      }
    } catch(e) {}
  }
}

findALLSpaces();
