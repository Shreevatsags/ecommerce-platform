const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes (no auth needed)

// GET /api/inventory/:product_id - Check stock
router.get('/:product_id', inventoryController.getStock);

// GET /api/inventory/:product_id/low-stock - Check if low stock
router.get('/:product_id/low-stock', inventoryController.checkLowStock);

// Protected routes (require auth)

// POST /api/inventory/init - Initialize stock (admin)
router.post('/init', protect, inventoryController.initializeStock);

// POST /api/inventory/reserve - Reserve stock (add to cart)
router.post('/reserve', protect, inventoryController.reserveStock);

// POST /api/inventory/confirm - Confirm reservation (after payment)
router.post('/confirm', protect, inventoryController.confirmReservation);

// DELETE /api/inventory/reserve/:product_id - Cancel reservation
router.delete('/reserve/:product_id', protect, inventoryController.cancelReservation);

// POST /api/inventory/:product_id/add - Add stock (restock)
router.post('/:product_id/add', protect, inventoryController.addStock);

module.exports = router;