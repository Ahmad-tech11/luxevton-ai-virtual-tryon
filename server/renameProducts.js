const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

async function renameProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    console.log(`Found ${products.length} products. Starting renaming...`);

    const brands = [
      'Sapphire', 'Khaadi', 'Outfitters', 'Zellbury', 'Cougar', 'J.', 'Junaid Jamshed', 'Gul Ahmed', 'Sana Safinaz', 'Maria B'
    ];

    let updateCount = 0;

    for (const product of products) {
      let newTitle = product.title;
      let newDescription = product.description || '';
      
      // Remove existing brand names if present
      brands.forEach(brand => {
        // Case-insensitive regex to remove brand name
        const regex = new RegExp(`^${brand}\\s+|\\s+${brand}\\s+|^${brand}$`, 'ig');
        newTitle = newTitle.replace(regex, ' ').trim();
        
        // Also remove brand names from description
        const descRegex = new RegExp(`\\b${brand}\\b`, 'ig');
        newDescription = newDescription.replace(descRegex, 'Luxe VTON').trim();
      });

      // Ensure "Luxe VTON" is at the start
      if (!newTitle.startsWith('Luxe VTON')) {
          newTitle = `Luxe VTON ${newTitle}`;
      }

      // Final cleanup of extra spaces
      newTitle = newTitle.replace(/\s+/g, ' ').trim();
      newDescription = newDescription.replace(/\s+/g, ' ').trim();

      if (newTitle !== product.title || newDescription !== product.description) {
        product.title = newTitle;
        product.description = newDescription;
        await product.save();
        updateCount++;
      }
    }

    console.log(`Successfully updated ${updateCount} products to use "Luxe Vton" branding.`);
    process.exit(0);
  } catch (err) {
    console.error('Error renaming products:', err);
    process.exit(1);
  }
}

renameProducts();
