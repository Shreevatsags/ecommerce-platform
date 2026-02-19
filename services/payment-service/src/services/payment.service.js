const pool = require('../config/database');
const stripeService = require('./stripe.service');
const axios = require('axios');

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3002';

class PaymentService {
  
  // Process a payment
  async processPayment(userId, paymentData) {
    const { order_id, amount, payment_method } = paymentData;
    
    try {
      // Step 1: Verify order exists
      console.log('📦 Verifying order:', order_id);
      // In production, make API call to Order Service here
      
      // Step 2: Process payment with Stripe
      console.log('💳 Processing payment with Stripe...');
      const stripePayment = await stripeService.createPayment(
        amount,
        payment_method,
        { order_id, user_id: userId }
      );
      
      // Step 3: Save payment to database
      const result = await pool.query(
        `INSERT INTO payments (order_id, user_id, amount, payment_method, stripe_payment_id, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          order_id,
          userId,
          amount,
          'card',
          stripePayment.id,
          stripePayment.status
        ]
      );
      
      const payment = result.rows[0];
      
      // Step 4: Update order status (in production, call Order Service API)
      console.log('✅ Payment successful! Updating order...');
      
      return payment;
      
    } catch (error) {
      // Save failed payment
      await pool.query(
        `INSERT INTO payments (order_id, user_id, amount, payment_method, status)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [order_id, userId, amount, 'card', 'failed']
      );
      
      throw error;
    }
  }
  
  // Get payment by ID
  async getPaymentById(paymentId, userId) {
    const result = await pool.query(
      'SELECT * FROM payments WHERE id = $1 AND user_id = $2',
      [paymentId, userId]
    );
    
    return result.rows[0];
  }
  
  // Get all payments for an order
  async getPaymentsByOrderId(orderId, userId) {
    const result = await pool.query(
      'SELECT * FROM payments WHERE order_id = $1 AND user_id = $2 ORDER BY created_at DESC',
      [orderId, userId]
    );
    
    return result.rows;
  }
  
  // Get user's payment history
  async getUserPayments(userId) {
    const result = await pool.query(
      'SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    return result.rows;
  }
  
  // Issue refund
  async issueRefund(paymentId, userId) {
    // Get payment
    const result = await pool.query(
      'SELECT * FROM payments WHERE id = $1 AND user_id = $2',
      [paymentId, userId]
    );
    
    const payment = result.rows[0];
    
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    if (payment.status !== 'succeeded') {
      throw new Error('Can only refund successful payments');
    }
    
    // Process refund with Stripe
    const refund = await stripeService.createRefund(
      payment.stripe_payment_id,
      payment.amount
    );
    
    // Update payment status
    await pool.query(
      `UPDATE payments 
       SET status = $1, updated_at = NOW()
       WHERE id = $2`,
      ['refunded', paymentId]
    );
    
    return refund;
  }
}

module.exports = new PaymentService();