const productService = require('../services/product.service');

class ProductController {
  // Handle GET /api/products (get all products)
  async getProducts(req, res) {
    try {
      const products = await productService.getAllProducts();
      
      res.json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get products',
        error: error.message
      });
    }
  }

  // Handle GET /api/products/:id (get one product)
  async getProduct(req, res) {
    try {
      const { id } = req.params; // Get ID from URL
      const product = await productService.getProductById(id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get product',
        error: error.message
      });
    }
  }

  // Handle POST /api/products (create new product)
  async createProduct(req, res) {
    try {
      // Get data from request body
      const { name, description, price, stock } = req.body;
      
      // Validate required fields
      if (!name || !price) {
        return res.status(400).json({
          success: false,
          message: 'Name and price are required'
        });
      }

      const product = await productService.createProduct(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create product',
        error: error.message
      });
    }
  }

  // Handle PUT /api/products/:id (update product)
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await productService.updateProduct(id, req.body);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update product',
        error: error.message
      });
    }
  }

  // Handle DELETE /api/products/:id (delete product)
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const deleted = await productService.deleteProduct(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete product',
        error: error.message
      });
    }
  }
}

module.exports = new ProductController();