const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// GET /api/products - List all products
router.get('/', productController.getProducts);

// GET /api/products/:id - Get one product
router.get('/:id', productController.getProduct);

// POST /api/products - Create product
router.post('/', productController.createProduct);

module.exports = router;