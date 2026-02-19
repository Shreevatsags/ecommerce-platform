import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

  // Load products when page loads
  useEffect(() => {
    loadProducts();
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  // Fetch products from API
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load products. Is the Product Service running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add to cart
  const addToCart = (product) => {
    const newCart = [...cart];
    const existingItem = newCart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      newCart.push({ ...product, quantity: 1 });
    }

    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    alert(`Added ${product.name} to cart!`);
  };

  // Show loading
  if (loading) {
    return (
      <div style={styles.container}>
        <h1>Loading products...</h1>
      </div>
    );
  }

  // Show error
  if (error) {
    return (
      <div style={styles.container}>
        <h1 style={{ color: 'red' }}>Error!</h1>
        <p>{error}</p>
        <button onClick={loadProducts} style={styles.button}>
          Try Again
        </button>
      </div>
    );
  }

  // Show products
  return (
    <div style={styles.container}>
      

      {/* Products Grid */}
      <div style={styles.grid}>
        {products.map(product => (
          <div key={product.id} style={styles.card}>
            {/* Product Image Placeholder */}
            <div style={styles.imagePlaceholder}>
              📱
            </div>

            {/* Product Info */}
            <h3 style={styles.productName}>{product.name}</h3>
            <p style={styles.description}>{product.description}</p>
            <p style={styles.price}>${product.price}</p>
            <p style={styles.stock}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>

            {/* Add to Cart Button */}
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              style={product.stock > 0 ? styles.button : styles.buttonDisabled}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple inline styles (we'll make it prettier later!)
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '8px',
    marginBottom: '30px'
  },
  cart: {
    fontSize: '18px',
    cursor: 'pointer'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px'
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  imagePlaceholder: {
    fontSize: '60px',
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    marginBottom: '15px'
  },
  productName: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '10px 0'
  },
  description: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px'
  },
  price: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#4CAF50',
    margin: '10px 0'
  },
  stock: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  buttonDisabled: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#ccc',
    color: '#666',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'not-allowed'
  }
};

export default HomePage;