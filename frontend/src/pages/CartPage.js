import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  // Calculate total
  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  // Update quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const newCart = cart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );

    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  // Remove item
  const removeItem = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  // Go to checkout
  const handleCheckout = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please login first!');
      navigate('/login');
      return;
    }

    navigate('/checkout');
  };

  // Empty cart
  if (cart.length === 0) {
    return (
      <div style={styles.container}>
        <h1>Shopping Cart</h1>
        <div style={styles.empty}>
          <p>🛒 Your cart is empty</p>
          <button onClick={() => navigate('/')} style={styles.button}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/')} style={styles.backButton}>
          ← Back to Shop
        </button>
        <h1>Shopping Cart ({cart.length} items)</h1>
      </div>

      {/* Cart Items */}
      <div style={styles.cartItems}>
        {cart.map(item => (
          <div key={item.id} style={styles.cartItem}>
            {/* Product Info */}
            <div style={styles.itemInfo}>
              <h3>{item.name}</h3>
              <p style={styles.price}>${item.price}</p>
            </div>

            {/* Quantity Controls */}
            <div style={styles.quantityControls}>
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                style={styles.quantityButton}
              >
                -
              </button>
              <span style={styles.quantity}>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                style={styles.quantityButton}
              >
                +
              </button>
            </div>

            {/* Subtotal */}
            <div style={styles.subtotal}>
              ${(item.price * item.quantity).toFixed(2)}
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeItem(item.id)}
              style={styles.removeButton}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={styles.summary}>
        <h2>Order Summary</h2>
        <div style={styles.summaryRow}>
          <span>Subtotal:</span>
          <span>${getTotal()}</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div style={styles.totalRow}>
          <span>Total:</span>
          <span>${getTotal()}</span>
        </div>
        <button onClick={handleCheckout} style={styles.checkoutButton}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px'
  },
  header: {
    marginBottom: '30px'
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '10px'
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px'
  },
  cartItems: {
    marginBottom: '30px'
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '15px',
    gap: '20px'
  },
  itemInfo: {
    flex: 1
  },
  price: {
    color: '#666',
    fontSize: '14px'
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  quantityButton: {
    width: '30px',
    height: '30px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '16px'
  },
  quantity: {
    fontSize: '16px',
    fontWeight: 'bold',
    minWidth: '30px',
    textAlign: 'center'
  },
  subtotal: {
    fontSize: '18px',
    fontWeight: 'bold',
    minWidth: '100px',
    textAlign: 'right'
  },
  removeButton: {
    padding: '8px 16px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  summary: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '400px',
    marginLeft: 'auto'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #ddd'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  checkoutButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px'
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer'
  }
};

export default CartPage;