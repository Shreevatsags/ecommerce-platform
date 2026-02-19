import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI, paymentAPI } from '../services/api';

function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'US'
  });
  const [payment, setPayment] = useState({
    card_number: '4242424242424242', // Test card
    exp_month: 12,
    exp_year: 2025,
    cvc: '123'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (savedCart.length === 0) {
      alert('Your cart is empty!');
      navigate('/cart');
    }
    setCart(savedCart);
  }, [navigate]);

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Create order
      const orderItems = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));

      const orderResponse = await orderAPI.create({
        items: orderItems,
        shipping_address: address
      });

      const orderId = orderResponse.data.data.id;
      console.log('Order created:', orderId);

      // Step 2: Process payment
      await paymentAPI.process({
        order_id: orderId,
        amount: parseFloat(getTotal()),
        payment_method: payment
      });

      console.log('Payment successful!');

      // Clear cart
      localStorage.removeItem('cart');

      // Redirect to success page
      navigate('/order-success', { state: { orderId } });

    } catch (error) {
      alert('Order failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Checkout</h1>

      <div style={styles.layout}>
        {/* Left Side - Forms */}
        <div style={styles.forms}>
          <form onSubmit={handlePlaceOrder}>
            {/* Shipping Address */}
            <div style={styles.section}>
              <h2>Shipping Address</h2>
              <div style={styles.formGroup}>
                <label style={styles.label}>Street Address</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  style={styles.input}
                  placeholder="123 Main St"
                  required
                />
              </div>
              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    style={styles.input}
                    placeholder="New York"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>State</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    style={styles.input}
                    placeholder="NY"
                    required
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>ZIP Code</label>
                <input
                  type="text"
                  value={address.zip_code}
                  onChange={(e) => setAddress({ ...address, zip_code: e.target.value })}
                  style={styles.input}
                  placeholder="10001"
                  required
                />
              </div>
            </div>

            {/* Payment Info */}
            <div style={styles.section}>
              <h2>Payment Information</h2>
              <p style={styles.testNote}>
                💳 Test card: 4242 4242 4242 4242
              </p>
              <div style={styles.formGroup}>
                <label style={styles.label}>Card Number</label>
                <input
                  type="text"
                  value={payment.card_number}
                  onChange={(e) => setPayment({ ...payment, card_number: e.target.value })}
                  style={styles.input}
                  placeholder="4242424242424242"
                  maxLength="16"
                  required
                />
              </div>
              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Expiry Month</label>
                  <input
                    type="number"
                    value={payment.exp_month}
                    onChange={(e) => setPayment({ ...payment, exp_month: parseInt(e.target.value) })}
                    style={styles.input}
                    placeholder="12"
                    min="1"
                    max="12"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Expiry Year</label>
                  <input
                    type="number"
                    value={payment.exp_year}
                    onChange={(e) => setPayment({ ...payment, exp_year: parseInt(e.target.value) })}
                    style={styles.input}
                    placeholder="2025"
                    min="2024"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>CVC</label>
                  <input
                    type="text"
                    value={payment.cvc}
                    onChange={(e) => setPayment({ ...payment, cvc: e.target.value })}
                    style={styles.input}
                    placeholder="123"
                    maxLength="3"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={loading ? styles.buttonDisabled : styles.button}
            >
              {loading ? 'Processing...' : `Place Order - $${getTotal()}`}
            </button>
          </form>
        </div>

        {/* Right Side - Order Summary */}
        <div style={styles.summary}>
          <h2>Order Summary</h2>
          {cart.map(item => (
            <div key={item.id} style={styles.summaryItem}>
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={styles.total}>
            <span>Total:</span>
            <span>${getTotal()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '30px',
    marginTop: '20px'
  },
  forms: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  section: {
    marginBottom: '30px'
  },
  testNote: {
    backgroundColor: '#e3f2fd',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px'
  },
  formGroup: {
    marginBottom: '15px'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px'
  },
  buttonDisabled: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#ccc',
    color: '#666',
    border: 'none',
    borderRadius: '4px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'not-allowed',
    marginTop: '20px'
  },
  summary: {
    backgroundColor: '#f9f9f9',
    padding: '30px',
    borderRadius: '8px',
    height: 'fit-content',
    position: 'sticky',
    top: '20px'
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #ddd'
  },
  total: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0',
    fontSize: '20px',
    fontWeight: 'bold',
    marginTop: '10px'
  }
};

export default CheckoutPage;