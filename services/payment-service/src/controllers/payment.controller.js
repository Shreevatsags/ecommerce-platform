const paymentService = require('../services/payment.service');
const Joi = require('joi');

// Validation schema
const processPaymentSchema = Joi.object({
  order_id: Joi.string().required(),
  amount: Joi.number().positive().required(),
  payment_method: Joi.object({
    card_number: Joi.string().length(16).required(),
    exp_month: Joi.number().min(1).max(12).required(),
    exp_year: Joi.number().min(2024).required(),
    cvc: Joi.string().length(3).required()
  }).required()
});

class PaymentController {
  
  // POST /api/payments/process
  async processPayment(req, res) {
    try {
      // Validate input
      const { error, value } = processPaymentSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }
      
      const userId = req.user.userId;
      
      // Process payment
      const payment = await paymentService.processPayment(userId, value);
      
      res.status(201).json({
        success: true,
        message: 'Payment processed successfully!',
        data: payment
      });
      
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Payment failed',
        error: error.message
      });
    }
  }
  
  // GET /api/payments/:id
  async getPayment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      
      const payment = await paymentService.getPaymentById(id, userId);
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }
      
      res.json({
        success: true,
        data: payment
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get payment',
        error: error.message
      });
    }
  }
  
  // GET /api/payments/order/:order_id
  async getOrderPayments(req, res) {
    try {
      const { order_id } = req.params;
      const userId = req.user.userId;
      
      const payments = await paymentService.getPaymentsByOrderId(order_id, userId);
      
      res.json({
        success: true,
        count: payments.length,
        data: payments
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // GET /api/payments/history
  async getPaymentHistory(req, res) {
    try {
      const userId = req.user.userId;
      
      const payments = await paymentService.getUserPayments(userId);
      
      res.json({
        success: true,
        count: payments.length,
        data: payments
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // POST /api/payments/:id/refund
  async issueRefund(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      
      const refund = await paymentService.issueRefund(id, userId);
      
      res.json({
        success: true,
        message: 'Refund issued successfully',
        data: refund
      });
      
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Refund failed',
        error: error.message
      });
    }
  }
}

module.exports = new PaymentController();