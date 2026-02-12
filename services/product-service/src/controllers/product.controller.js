const productService = require('../services/product.service');

class ProductController {
  // GET /api/products
  async getProducts(req, res) {
    try {
      const products = await productService.getAllProducts();
      res.json({ success: true, data: products });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET /api/products/:id
  async getProduct(req, res) {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      res.json({ success: true, data: product });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // POST /api/products
  async createProduct(req, res) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new ProductController();