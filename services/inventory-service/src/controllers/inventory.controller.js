const inventoryService = require('../services/inventory.service');
const Joi = require('joi');

// Validation schemas
const initStockSchema = Joi.object({
  product_id: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().min(0).required()
});

const reserveStockSchema = Joi.object({
  product_id: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().positive().required()
});

class InventoryController {
  
  // POST /api/inventory/init - Initialize stock (admin only)
  async initializeStock(req, res) {
    try {
      const { error, value } = initStockSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }
      
      const result = await inventoryService.initializeStock(
        value.product_id,
        value.quantity
      );
      
      res.status(201).json({
        success: true,
        message: 'Stock initialized',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // GET /api/inventory/:product_id - Get stock info
  async getStock(req, res) {
    try {
      const { product_id } = req.params;
      const stock = await inventoryService.getStock(product_id);
      
      res.json({
        success: true,
        data: stock
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // POST /api/inventory/reserve - Reserve stock
  async reserveStock(req, res) {
    try {
      const { error, value } = reserveStockSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }
      
      const userId = req.user.userId;
      
      const reservation = await inventoryService.reserveStock(
        value.product_id,
        userId,
        value.quantity
      );
      
      res.status(201).json({
        success: true,
        message: 'Stock reserved successfully',
        data: reservation
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // POST /api/inventory/confirm - Confirm reservation (after payment)
  async confirmReservation(req, res) {
    try {
      const { product_id, quantity } = req.body;
      const userId = req.user.userId;
      
      const result = await inventoryService.confirmReservation(
        product_id,
        userId,
        quantity
      );
      
      res.json({
        success: true,
        message: 'Reservation confirmed, stock updated',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // DELETE /api/inventory/reserve/:product_id - Cancel reservation
  async cancelReservation(req, res) {
    try {
      const { product_id } = req.params;
      const userId = req.user.userId;
      
      const result = await inventoryService.cancelReservation(
        product_id,
        userId
      );
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // POST /api/inventory/:product_id/add - Add stock (restock)
  async addStock(req, res) {
    try {
      const { product_id } = req.params;
      const { quantity } = req.body;
      
      const result = await inventoryService.addStock(
        product_id,
        quantity
      );
      
      res.json({
        success: true,
        message: 'Stock added successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // GET /api/inventory/:product_id/low-stock - Check low stock
  async checkLowStock(req, res) {
    try {
      const { product_id } = req.params;
      const threshold = parseInt(req.query.threshold || 10);
      
      const result = await inventoryService.checkLowStock(
        product_id,
        threshold
      );
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new InventoryController();