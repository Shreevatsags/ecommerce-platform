const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes require authentication

// POST /api/payments/process - Process a payment
router.post('/process', protect, paymentController.processPayment);

// GET /api/payments/history - Get my payment history
router.get('/history', protect, paymentController.getPaymentHistory);

// GET /api/payments/order/:order_id - Get payments for specific order
router.get('/order/:order_id', protect, paymentController.getOrderPayments);

// GET /api/payments/:id - Get single payment details
router.get('/:id', protect, paymentController.getPayment);

// POST /api/payments/:id/refund - Issue refund
router.post('/:id/refund', protect, paymentController.issueRefund);

module.exports = router;