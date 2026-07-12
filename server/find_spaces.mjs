import { client } from "@gradio/client";

async function main() {
  const spaces = [
    "yisol/IDM-VTON",
    "Nymbo/Virtual-Try-On", 
    "Wildcard-huggingface/IDM-VTON",
    "Kwai-Kolors/Kolors-Virtual-Try-On",
    "xiaozaa/CatVTON_w_FLUX"
  ];
  
  for (const space of spaces) {
    try {
      console.log("Trying", space);
      const app = await client(space, {});
      console.log(space, "is alive! Endpoints:", app.config.dependencies.map(d => d.api_name).filter(Boolean));
    } catch (err) {
      console.log(space, "failed:", err.message.substring(0, 50));
    }
  }
}
main();
