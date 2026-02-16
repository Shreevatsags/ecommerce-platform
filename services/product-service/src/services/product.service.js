const pool = require('../config/database');
const { getCache, setCache, deleteCache, deleteCachePattern } = require('../config/redis');

class ProductService {
  // Get all products (with caching)
  async getAllProducts(page = 1, limit = 20) {
    const cacheKey = `products:list:page:${page}:limit:${limit}`;
    
    // Try to get from cache first
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return cachedData; // Return cached data
    }

    // If not in cache, get from database
    const offset = (page - 1) * limit;
    try {
      const result = await pool.query(
        'SELECT * FROM products ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      );
      
      const products = result.rows;
      
      // Save to cache for 5 minutes (300 seconds)
      await setCache(cacheKey, products, 300);
      
      return products;
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  }

  // Get single product by ID (with caching)
  async getProductById(id) {
    const cacheKey = `product:${id}`;
    
    // Try cache first
    const cachedProduct = await getCache(cacheKey);
    if (cachedProduct) {
      return cachedProduct;
    }

    // Get from database
    try {
      const result = await pool.query(
        'SELECT * FROM products WHERE id = $1',
        [id]
      );
      
      const product = result.rows[0];
      
      if (product) {
        // Cache for 10 minutes (600 seconds)
        await setCache(cacheKey, product, 600);
      }
      
      return product;
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  }

  // Create new product (invalidate cache)
  async createProduct(productData) {
    const { name, description, price, stock } = productData;
    
    try {
      const result = await pool.query(
        `INSERT INTO products (name, description, price, stock)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [name, description, price, stock]
      );
      
      const newProduct = result.rows[0];
      
      // Invalidate list caches (because we added a new item)
      await deleteCachePattern('products:list:*');
      
      console.log('✅ Created product and invalidated list cache');
      
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Update existing product (invalidate cache)
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
      
      const updatedProduct = result.rows[0];
      
      if (updatedProduct) {
        // Delete specific product cache
        await deleteCache(`product:${id}`);
        
        // Delete list caches (because product details changed)
        await deleteCachePattern('products:list:*');
        
        console.log('✅ Updated product and invalidated caches');
      }
      
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product (invalidate cache)
  async deleteProduct(id) {
    try {
      const result = await pool.query(
        'DELETE FROM products WHERE id = $1 RETURNING id',
        [id]
      );
      
      if (result.rows.length > 0) {
        // Delete specific product cache
        await deleteCache(`product:${id}`);
        
        // Delete list caches
        await deleteCachePattern('products:list:*');
        
        console.log('✅ Deleted product and invalidated caches');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Search products (with caching)
  async searchProducts(query) {
    const cacheKey = `products:search:${query.toLowerCase()}`;
    
    // Try cache first
    const cachedResults = await getCache(cacheKey);
    if (cachedResults) {
      return cachedResults;
    }

    // Search in database
    try {
      const result = await pool.query(
        `SELECT * FROM products 
         WHERE (name ILIKE $1 OR description ILIKE $1)
         ORDER BY created_at DESC
         LIMIT 50`,
        [`%${query}%`]
      );
      
      const products = result.rows;
      
      // Cache search results for 2 minutes (120 seconds)
      await setCache(cacheKey, products, 120);
      
      return products;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
}

module.exports = new ProductService();