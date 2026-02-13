const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Define all the routes (URLs)

// GET /api/products - Get all products
router.get('/', productController.getProducts);

// GET /api/products/:id - Get single product
router.get('/:id', productController.getProduct);

// POST /api/products - Create new product
router.post('/', productController.createProduct);

// PUT /api/products/:id - Update product
router.put('/:id', productController.updateProduct);

// DELETE /api/products/:id - Delete product
router.delete('/:id', productController.deleteProduct);

module.exports = router;
