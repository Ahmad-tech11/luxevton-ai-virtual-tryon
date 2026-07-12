const axios = require('axios');
const { client } = require('@gradio/client');

async function findSpaces() {
  console.log("Searching for VTON spaces on HF...");
  
  const query = 'VTON';
  const url = `https://huggingface.co/api/spaces?search=${query}&limit=20&sort=likes`;
  
  try {
    const res = await axios.get(url);
    const spaces = res.data;
    
    console.log(`Found ${spaces.length} spaces. Testing them...`);
    
    for (const s of spaces) {
      if (s.id.includes("CatVTON") || s.id.includes("OOT") || s.id.includes("IDM") || s.id.includes("Outfit")) {
        console.log(`Testing ${s.id}...`);
        try {
          const app = await client(s.id, {});
          const endpoints = app.config.dependencies.map(d => d.api_name).filter(Boolean);
          if (endpoints.length > 0) {
            console.log(`✅ [ALIVE] ${s.id} -> Endpoints: ${endpoints.join(', ')}`);
          }
        } catch(e) {
          // ignoring errors for dead spaces
        }
      }
    }
  } catch (err) {
    console.error("Search failed", err.message);
  }
}

findSpaces();
