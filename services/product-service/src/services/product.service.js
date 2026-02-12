const pool = require('../config/database');

class ProductService {
  // Get all products
  async getAllProducts() {
    const result = await pool.query(
      'SELECT * FROM products ORDER BY created_at DESC'
    );
    return result.rows;
  }

  // Get one product by ID
  async getProductById(id) {
    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Create new product
  async createProduct(productData) {
    const { name, description, price, stock } = productData;
    const result = await pool.query(
      `INSERT INTO products (name, description, price, stock)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description, price, stock]
    );
    return result.rows[0];
  }
}

module.exports = new ProductService();