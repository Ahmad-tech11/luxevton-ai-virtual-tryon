import { client } from '@gradio/client';
import fs from 'fs';

async function testIDM() {
  const IDM_SPACES = [
    'yisol/IDM-VTON',
    'ronniechoyy/IDM-VTON-20250428'
  ];
  
  for (const spaceName of IDM_SPACES) {
    console.log(`Testing ${spaceName}...`);
    try {
      let app = await client(spaceName, {});
      
      const userImageBuf = fs.readFileSync('user.jpg');
      const garmentBuf = fs.readFileSync('garment.jpg');
      const userBlob = new Blob([userImageBuf]);
      const garmentBlob = new Blob([garmentBuf]);

      console.log(`Predicting on ${spaceName}...`);
      const result = await app.predict('/tryon', [
        { background: userBlob, layers: [], composite: null },
        garmentBlob,        
        'shirt',              
        true,                             
        false,                            
        30,                               
        42,                               
      ]);
      console.log("Success!");
      return;
    } catch (err) {
      console.log(`Failed on ${spaceName}:`, err.message);
    }
  }
}
testIDM();
