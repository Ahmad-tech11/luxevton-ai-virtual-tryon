const axios = require('axios');
const fs = require('fs');

async function getShopifyImages() {
  const stores = [
    { name: 'Sapphire', url: 'https://pk.sapphireonline.pk/products.json?limit=250', gender: 'women' },
    { name: 'Khaadi', url: 'https://pk.khaadi.com/new-in.html' }, // Not shopify, we will skip or handle later
    { name: 'Zellbury', url: 'https://zellbury.com/products.json?limit=250', gender: 'women' },
    { name: 'Saya', url: 'https://saya.pk/products.json?limit=250', gender: 'women' },
    { name: 'Outfitters', url: 'https://outfitters.com.pk/products.json?limit=250', gender: 'men' },
    { name: 'Limelight', url: 'https://www.limelight.pk/products.json?limit=250', gender: 'women' },
    { name: 'Ethnic', url: 'https://ethnic.pk/products.json?limit=250', gender: 'women' },
  ];

  const results = { men: [], women: [], kids: [] };

  for (const store of stores) {
    if (!store.url.endsWith('.json')) continue;
    try {
      console.log(`Fetching from ${store.name}...`);
      const response = await axios.get(store.url);
      const products = response.data.products;
      
      for (const p of products) {
        if (p.images && p.images.length > 0) {
          // Find images for men, women, or kids based on tags or product type
          let targetGender = store.gender;
          const tags = p.tags ? p.tags.join(' ').toLowerCase() : '';
          const title = p.title.toLowerCase();
          
          if (tags.includes('men') || title.includes('men') || title.includes('boy')) targetGender = 'men';
          else if (tags.includes('kids') || title.includes('girl') || title.includes('kid')) targetGender = 'kids';
          else if (tags.includes('women') || title.includes('girl') || title.includes('lady')) targetGender = 'women';
          
          if (p.images[0] && p.images[0].src) {
            results[targetGender].push(p.images[0].src);
          }
        }
      }
    } catch (err) {
      console.error(`Failed ${store.name}: ${err.message}`);
    }
  }
  
  // Save to a file so we can use it in productGenerator
  fs.writeFileSync('brand_images.json', JSON.stringify(results, null, 2));
  console.log(`Saved ${results.men.length} men images, ${results.women.length} women images, and ${results.kids.length} kids images.`);
}

getShopifyImages();
