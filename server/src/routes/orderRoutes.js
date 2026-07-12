const express = require('express');
const router = express.Router();
const { createOrder, getOrderByNumber } = require('../controllers/orderController');

// Guest checkout - no auth required
router.post('/', createOrder);
router.get('/track/:orderNumber', getOrderByNumber);

module.exports = router;