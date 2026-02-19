// Mock Stripe service for testing
// In production, replace with real Stripe API calls

class StripeService {
  
  // Process payment (mock version)
  async createPayment(amount, paymentMethod, metadata = {}) {
    try {
      console.log('💳 Processing payment...');
      console.log('Amount:', amount);
      console.log('Card:', paymentMethod.card_number);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test card numbers (like real Stripe test mode)
      if (paymentMethod.card_number === '4242424242424242') {
        // Success!
        return {
          id: `pi_mock_${Date.now()}`,
          status: 'succeeded',
          amount: amount,
          currency: 'usd',
          created: Math.floor(Date.now() / 1000)
        };
      } else if (paymentMethod.card_number === '4000000000000002') {
        // Card declined
        throw new Error('Card was declined');
      } else {
        // Invalid card
        throw new Error('Invalid card number');
      }
      
    } catch (error) {
      console.error('❌ Payment failed:', error.message);
      throw error;
    }
  }
  
  // Get payment details
  async retrievePayment(paymentId) {
    console.log('🔍 Retrieving payment:', paymentId);
    
    return {
      id: paymentId,
      status: 'succeeded',
      amount: 2249.97
    };
  }
  
  // Issue refund
  async createRefund(paymentId, amount) {
    console.log('💰 Processing refund...');
    console.log('Payment ID:', paymentId);
    console.log('Amount:', amount);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: `re_mock_${Date.now()}`,
      payment_id: paymentId,
      status: 'succeeded',
      amount: amount
    };
  }
}

module.exports = new StripeService();