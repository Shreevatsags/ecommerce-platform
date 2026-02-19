import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div style={styles.container}>
      <div style={styles.successBox}>
        <div style={styles.checkmark}>✅</div>
        <h1 style={styles.title}>Order Placed Successfully!</h1>
        <p style={styles.message}>
          Thank you for your purchase!
        </p>
        {orderId && (
          <div style={styles.orderInfo}>
            <p>Order ID: <strong>{orderId}</strong></p>
            <p>A confirmation email has been sent to your email address.</p>
          </div>
        )}
        
        <div style={styles.buttons}>
          <button 
            onClick={() => navigate('/orders')} 
            style={styles.primaryButton}
          >
            View My Orders
          </button>
          <button 
            onClick={() => navigate('/')} 
            style={styles.secondaryButton}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  successBox: {
    backgroundColor: 'white',
    padding: '60px 40px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '500px'
  },
  checkmark: {
    fontSize: '80px',
    marginBottom: '20px'
  },
  title: {
    color: '#4CAF50',
    marginBottom: '10px'
  },
  message: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '30px'
  },
  orderInfo: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px'
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  primaryButton: {
    padding: '14px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  secondaryButton: {
    padding: '14px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer'
  }
};

export default OrderSuccessPage;