const redis = require('../config/redis');

class InventoryService {
  
  // Initialize stock for a product
  async initializeStock(productId, quantity) {
    const key = `inventory:${productId}`;
    await redis.set(key, quantity);
    console.log(`📦 Initialized stock for product ${productId}: ${quantity}`);
    return { product_id: productId, stock: quantity };
  }
  
  // Get current stock
  async getStock(productId) {
    const key = `inventory:${productId}`;
    const stock = await redis.get(key);
    
    if (stock === null) {
      return { product_id: productId, stock: 0, available: 0 };
    }
    
    // Get reserved stock
    const reservedKey = `reserved:${productId}:*`;
    const reservedKeys = await redis.keys(reservedKey);
    
    let totalReserved = 0;
    for (const rKey of reservedKeys) {
      const reserved = await redis.get(rKey);
      totalReserved += parseInt(reserved || 0);
    }
    
    const available = parseInt(stock) - totalReserved;
    
    return {
      product_id: productId,
      total_stock: parseInt(stock),
      reserved: totalReserved,
      available: Math.max(0, available)
    };
  }
  
  // Reserve stock (when user adds to cart)
  async reserveStock(productId, userId, quantity) {
    const stockInfo = await this.getStock(productId);
    
    // Check if enough stock available
    if (stockInfo.available < quantity) {
      throw new Error(
        `Not enough stock! Available: ${stockInfo.available}, Requested: ${quantity}`
      );
    }
    
    // Reserve the stock
    const reservationKey = `reserved:${productId}:${userId}`;
    const timeout = parseInt(process.env.RESERVATION_TIMEOUT || 600);
    
    await redis.setex(reservationKey, timeout, quantity);
    
    console.log(`🔒 Reserved ${quantity} units of product ${productId} for user ${userId}`);
    console.log(`⏰ Reservation expires in ${timeout} seconds`);
    
    return {
      product_id: productId,
      user_id: userId,
      quantity: quantity,
      expires_in_seconds: timeout,
      message: `Reserved! Complete checkout within ${Math.floor(timeout / 60)} minutes`
    };
  }
  
  // Confirm reservation (when order is paid)
  async confirmReservation(productId, userId, quantity) {
    const reservationKey = `reserved:${productId}:${userId}`;
    const reserved = await redis.get(reservationKey);
    
    if (!reserved) {
      throw new Error('No reservation found or reservation expired');
    }
    
    if (parseInt(reserved) !== quantity) {
      throw new Error('Reserved quantity does not match');
    }
    
    // Remove from total stock
    const stockKey = `inventory:${productId}`;
    await redis.decrby(stockKey, quantity);
    
    // Remove reservation
    await redis.del(reservationKey);
    
    console.log(`✅ Confirmed reservation and reduced stock by ${quantity}`);
    
    const newStock = await this.getStock(productId);
    return newStock;
  }
  
  // Cancel reservation (when user abandons cart)
  async cancelReservation(productId, userId) {
    const reservationKey = `reserved:${productId}:${userId}`;
    const reserved = await redis.get(reservationKey);
    
    if (!reserved) {
      return { message: 'No reservation found' };
    }
    
    await redis.del(reservationKey);
    
    console.log(`❌ Cancelled reservation for user ${userId}`);
    
    return {
      message: 'Reservation cancelled',
      released_quantity: parseInt(reserved)
    };
  }
  
  // Add stock (restocking)
  async addStock(productId, quantity) {
    const stockKey = `inventory:${productId}`;
    await redis.incrby(stockKey, quantity);
    
    console.log(`📦 Added ${quantity} units to product ${productId}`);
    
    return await this.getStock(productId);
  }
  
  // Check if product has low stock
  async checkLowStock(productId, threshold = 10) {
    const stockInfo = await this.getStock(productId);
    
    if (stockInfo.available <= threshold) {
      return {
        low_stock: true,
        product_id: productId,
        available: stockInfo.available,
        threshold: threshold,
        message: `⚠️ Low stock alert! Only ${stockInfo.available} units remaining`
      };
    }
    
    return {
      low_stock: false,
      product_id: productId,
      available: stockInfo.available
    };
  }
}

module.exports = new InventoryService();