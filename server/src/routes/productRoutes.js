const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  getCategories,
} = require('../controllers/productController');

// All routes are public - no auth required
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);

module.exports = router;