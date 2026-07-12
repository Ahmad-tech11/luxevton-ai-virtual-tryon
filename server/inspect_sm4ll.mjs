import { client } from '@gradio/client';
import fs from 'fs';

async function inspectSm4ll() {
  console.log("Connecting to sm4ll-VTON...");
  const app = await client("sm4ll-VTON/sm4ll-VTON-Demo", {});
  
  const genDep = app.config.dependencies.find(d => d.api_name === "generate");
  const inputs = genDep.inputs.map(id => {
    const comp = app.config.components.find(c => c.id === id);
    return {
      id: comp.id,
      type: comp.type,
      label: comp.props?.label,
      choices: comp.props?.choices,
      value: comp.props?.value,
      minimum: comp.props?.minimum,
      maximum: comp.props?.maximum,
    };
  });
  const outputs = genDep.outputs.map(id => {
    const comp = app.config.components.find(c => c.id === id);
    return { id: comp.id, type: comp.type, label: comp.props?.label };
  });
  
  console.log("INPUTS:", JSON.stringify(inputs, null, 2));
  console.log("OUTPUTS:", JSON.stringify(outputs, null, 2));
}

inspectSm4ll().catch(console.error);
