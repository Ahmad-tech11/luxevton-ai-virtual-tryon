import { client } from "@gradio/client";

async function main() {
  try {
    const app = await client("levihsu/OOTDiffusion");
    const hd = app.config.dependencies.find(d => d.api_name === "process_hd");
    console.log("Inputs:", hd.inputs.map(i => app.config.components.find(c => c.id === i)?.type));
    console.log("Outputs:", hd.outputs.map(o => app.config.components.find(c => c.id === o)?.type));
  } catch (err) {
    console.error(err);
  }
}

main();
