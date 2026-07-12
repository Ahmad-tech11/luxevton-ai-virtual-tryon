const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

async function updateFeatured() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Reset Men's Featured and set specific ones
    await Product.updateMany({ gender: 'men' }, { featured: false });
    const menFeaturedTitles = [
      'Cougar Premium Silk Shalwar Kameez', 
      'Outfitters Premium Dress Shirt', 
      'Cougar Classic Pique Polo', 
      'Cougar Premium Leather Jacket'
    ];
    await Product.updateMany({ title: { $in: menFeaturedTitles }, gender: 'men' }, { featured: true });

    // 2. Reset Women's Featured and set specific ones (Polo, Formal Shirt, Bridal, Sharara)
    await Product.updateMany({ gender: 'women' }, { featured: false });
    
    // Update existing women's products to become Polo and Formal Shirts
    await Product.findOneAndUpdate({ title: 'Khaadi Floral Maxi Dress' }, { 
      title: 'Sapphire Premium Cotton Polo Shirt', 
      category: 'shirts',
      featured: true 
    });
    await Product.findOneAndUpdate({ title: 'Outfitters Wool Long Coat' }, { 
      title: 'J. Designer Silk Formal Shirt', 
      category: 'shirts',
      featured: true 
    });
    
    // Set Bridal and Sharara as featured
    await Product.updateMany({ 
      title: { $in: ['Sapphire Bridal Red Lehenga', 'Outfitters Embroidered Sharara Set'] },
      gender: 'women'
    }, { featured: true });

    // 3. Keep Kids as they are (assuming they already have featured: true)
    // No changes to Kids.

    console.log('Featured products updated successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error updating featured products:', err);
    process.exit(1);
  }
}

updateFeatured();
