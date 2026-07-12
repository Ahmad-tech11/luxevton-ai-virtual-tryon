import { client } from '@gradio/client';
import fs from 'fs';

async function getConfig() {
  const app = await client("fashn-ai/fashn-vton-1.5");
  const dep = app.config.dependencies.find(d => d.api_name === "try_on");
  
  const inputs = dep.inputs.map(id => {
    const comp = app.config.components.find(c => c.id === id);
    return {
      id: comp.id,
      type: comp.type,
      props: comp.props
    };
  });
  
  fs.writeFileSync('fashn_config.json', JSON.stringify(inputs, null, 2));
  console.log("Saved.");
}
getConfig();
