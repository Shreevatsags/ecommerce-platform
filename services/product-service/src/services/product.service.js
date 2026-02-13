const pool = require('../config/database');

class ProductService {
  // Get all products from database
  async getAllProducts() {
    try {
      const result = await pool.query(
        'SELECT * FROM products ORDER BY created_at DESC'
      );
      return result.rows; // Return array of products
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  }

  // Get ONE product by ID
  async getProductById(id) {
    try {
      const result = await pool.query(
        'SELECT * FROM products WHERE id = $1',
        [id]
      );
      return result.rows[0]; // Return single product (or undefined if not found)
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  }

  // Create new product
  async createProduct(productData) {
    const { name, description, price, stock } = productData;
    
    try {
      const result = await pool.query(
        `INSERT INTO products (name, description, price, stock)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [name, description, price, stock]
      );
      return result.rows[0]; // Return the newly created product
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Update existing product
  async updateProduct(id, productData) {
    const { name, description, price, stock } = productData;
    
    try {
      const result = await pool.query(
        `UPDATE products 
         SET name = $1, description = $2, price = $3, stock = $4, updated_at = NOW()
         WHERE id = $5
         RETURNING *`,
        [name, description, price, stock, id]
      );
      return result.rows[0]; // Return updated product
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product
  async deleteProduct(id) {
    try {
      const result = await pool.query(
        'DELETE FROM products WHERE id = $1 RETURNING id',
        [id]
      );
      return result.rows.length > 0; // Returns true if deleted, false if not found
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}

// Export a single instance (singleton pattern)
module.exports = new ProductService();