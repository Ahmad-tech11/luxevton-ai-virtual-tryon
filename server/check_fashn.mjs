import { client } from "@gradio/client";

async function main() {
  try {
    const app = await client("fashn-ai/fashn-vton-1.5");
    const endpoint = app.config.dependencies.find(d => d.api_name === "try_on");
    console.log("Inputs:", endpoint.inputs.map(i => app.config.components.find(c => c.id === i)?.type));
  } catch(e) {
    console.error(e);
  }
}
main();
