import { client } from "@gradio/client";

async function main() {
  try {
    const app = await client("xiaozaa/CatVTON_w_FLUX");
    console.log("CatVTON available!");
  } catch (err) {
    console.error(err);
  }
}
main();
