const Product = require('../../models/Product');
const logger = require('./logger');
const menProducts = require('./data/menProducts');
const womenProducts = require('./data/womenProducts');
const kidsProducts = require('./data/kidsProducts');

const seedDatabase = async () => {
  try {
    if (process.env.NODE_ENV === 'production') throw new Error('Seeding disabled in production');
    await Product.deleteMany();
    const allProducts = [...menProducts, ...womenProducts, ...kidsProducts];
    await Product.insertMany(allProducts);
    logger.info(`${allProducts.length} products seeded successfully`);
  } catch (error) {
    logger.error('Seed error:', error);
    throw error;
  }
};
module.exports = { seedDatabase };