import { client } from "@gradio/client";

async function main() {
  const app = await client("ovi054/virtual-tryon-flux-kontext");
  const endpoints = app.config.dependencies.map(dep => {
    return {
      endpoint: dep.api_name,
      inputs: dep.inputs.map(i => app.config.components.find(c => c.id === i)?.type),
      outputs: dep.outputs.map(o => app.config.components.find(c => c.id === o)?.type)
    }
  });
  console.log(JSON.stringify(endpoints, null, 2));
}

main().catch(console.error);
