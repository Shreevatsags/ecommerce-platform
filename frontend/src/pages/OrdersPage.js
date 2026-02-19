import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await orderAPI.getAll();
      setOrders(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h1>Loading orders...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={() => navigate('/login')} style={styles.button}>
          Please Login
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={styles.container}>
        <h1>My Orders</h1>
        <div style={styles.empty}>
          <p>📦 You haven't placed any orders yet</p>
          <button onClick={() => navigate('/')} style={styles.button}>
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>My Orders ({orders.length})</h1>
        <button onClick={() => navigate('/')} style={styles.backButton}>
          ← Back to Shop
        </button>
      </div>

      <div style={styles.ordersList}>
        {orders.map(order => (
          <div key={order.id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <div>
                <h3>Order #{order.id.substring(0, 8)}...</h3>
                <p style={styles.orderDate}>
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div style={styles.statusBadge}>
                {order.status}
              </div>
            </div>

            <div style={styles.orderItems}>
              {order.items.map((item, index) => (
                <div key={index} style={styles.orderItem}>
                  <span>{item.product_name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={styles.orderFooter}>
              <div style={styles.total}>
                <strong>Total:</strong>
                <strong>${order.total_amount}</strong>
              </div>
              <div style={styles.address}>
                📍 {order.shipping_address.street}, {order.shipping_address.city}
              </div>
            </div>
          </div>
        ))}
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px'
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  orderCard: {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee'
  },
  orderDate: {
    color: '#666',
    fontSize: '14px',
    margin: '5px 0 0 0'
  },
  statusBadge: {
    padding: '6px 12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  orderItems: {
    marginBottom: '15px'
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '14px'
  },
  orderFooter: {
    paddingTop: '15px',
    borderTop: '1px solid #eee'
  },
  total: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '18px',
    marginBottom: '10px'
  },
  address: {
    fontSize: '14px',
    color: '#666'
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '20px'
  }
};

export default OrdersPage;