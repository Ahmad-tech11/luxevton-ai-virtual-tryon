import axios from 'axios';
import fs from 'fs';

async function download() {
  const url = "https://snapwearai-snapwear-virtual-try-on.hf.space/gradio_api/file=/tmp/gradio/ba476c27eb898b14bbc6b5c83712dc88513cc201e7a3787dfe2bb5ec6ba682cd/image.webp";
  
  console.log("Downloading result image...");
  try {
    const resp = await axios.get(url, { responseType: 'arraybuffer' });
    fs.writeFileSync('result_snap.webp', resp.data);
    console.log("Downloaded! Size:", resp.data.length, "bytes");
    console.log("Saved as result_snap.webp");
  } catch(e) {
    console.log("Download failed:", e.message);
  }
}

download();
