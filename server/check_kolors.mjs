import { client } from "@gradio/client";

async function main() {
  try {
    const app = await client("Kwai-Kolors/Kolors-Virtual-Try-On");
    const endpoints = app.config.dependencies.map(dep => {
      return {
        endpoint: dep.api_name,
        inputs: dep.inputs.map(i => app.config.components.find(c => c.id === i)?.type),
        outputs: dep.outputs.map(o => app.config.components.find(c => c.id === o)?.type)
      }
    });
    console.log(JSON.stringify(endpoints.filter(e => e.endpoint), null, 2));
  } catch (err) {
    console.error(err);
  }
}

main();
