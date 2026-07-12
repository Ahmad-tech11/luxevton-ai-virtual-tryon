const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeImages() {
  const sources = [
    { name: 'Khaadi', url: 'https://pk.khaadi.com/new-in.html' },
    { name: 'Saya', url: 'https://saya.pk/collections/unstitched' },
    { name: 'Outfitters', url: 'https://outfitters.com.pk/collections/men-new-arrivals' },
    { name: 'Limelight', url: 'https://www.limelight.pk/collections/new-arrivals' },
  ];

  const results = {};

  for (const source of sources) {
    try {
      const response = await axios.get(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 10000
      });
      const $ = cheerio.load(response.data);
      const images = new Set();
      
      $('img').each((i, el) => {
        let src = $(el).attr('data-src') || $(el).attr('src') || $(el).attr('data-original') || $(el).attr('data-srcset');
        if (!src) return;
        
        // Extract the first URL if it's a srcset
        src = src.split(',')[0].split(' ')[0];
        
        if (!src.includes('logo') && !src.includes('icon') && !src.includes('svg')) {
          if (src.startsWith('//')) {
            src = 'https:' + src;
          } else if (src.startsWith('/')) {
            const urlObj = new URL(source.url);
            src = urlObj.origin + src;
          }
          
          if (src.includes('.jpg') || src.includes('.jpeg') || src.includes('.webp') || src.includes('.png')) {
            // Shopify image URL cleanup (remove width parameters, _small, etc.)
            let cleanSrc = src;
            cleanSrc = cleanSrc.replace(/&width=\d+/g, '');
            cleanSrc = cleanSrc.replace(/\?v=\d+/g, '');
            cleanSrc = cleanSrc.replace(/_\d+x\d+\./g, '.');
            cleanSrc = cleanSrc.replace(/_small\./g, '.');
            
            if (cleanSrc.includes('cdn') || cleanSrc.includes('media')) {
               images.add(cleanSrc);
            }
          }
        }
      });
      
      results[source.name] = Array.from(images).filter(img => !img.includes('placeholder') && !img.includes('insta')).slice(0, 15);
    } catch (err) {
      console.error(`Failed to scrape ${source.name}: ${err.message}`);
    }
  }
  
  console.log(JSON.stringify(results, null, 2));
}

scrapeImages();
