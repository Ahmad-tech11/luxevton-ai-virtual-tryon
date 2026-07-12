const axios = require('axios');
const fs = require('fs');

async function scrapeRawHtml() {
  const urls = [
    'https://pk.sapphireonline.pk/collections/mens-stitched',
    'https://pk.sapphireonline.pk/collections/unstitched',
    'https://zellbury.com/collections/man',
    'https://zellbury.com/collections/woman-ready-to-wear',
    'https://outfitters.com.pk/collections/men-new-arrivals',
    'https://outfitters.com.pk/collections/women-new-arrivals',
    'https://ethnic.pk/collections/women',
    'https://saya.pk/collections/unstitched',
  ];

  const images = { men: [], women: [], kids: [] };

  for (const url of urls) {
    try {
      console.log(`Fetching ${url}...`);
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        }
      });
      
      const html = response.data;
      // Extract all jpg/webp urls
      const regex = /https:\/\/[^"'\s]+\.(?:jpg|jpeg|webp)/g;
      const matches = html.match(regex);
      
      if (matches) {
        const uniqueMatches = [...new Set(matches)];
        const validImages = uniqueMatches.filter(m => 
          !m.includes('icon') && 
          !m.includes('logo') && 
          !m.includes('banner') &&
          !m.includes('100x') &&
          !m.includes('small') &&
          (m.includes('cdn') || m.includes('media'))
        ).map(m => {
          // Remove small width parameters if any
          return m.replace(/width=\d+/, 'width=800').replace(/_\d+x\d+\./, '.');
        });
        
        const gender = url.includes('men') && !url.includes('women') ? 'men' : 'women';
        images[gender].push(...validImages);
        console.log(`Found ${validImages.length} for ${gender} from ${url}`);
      }
    } catch (e) {
      console.log(`Error on ${url}: ${e.message}`);
    }
  }

  // Deduplicate
  images.men = [...new Set(images.men)].slice(0, 50);
  images.women = [...new Set(images.women)].slice(0, 50);
  
  fs.writeFileSync('scraped_urls.json', JSON.stringify(images, null, 2));
  console.log(`Total: Men: ${images.men.length}, Women: ${images.women.length}`);
}

scrapeRawHtml();
