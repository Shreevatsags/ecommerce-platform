import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Update cart count
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    };

    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    updateCartCount();

    // Listen for storage changes
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logo} onClick={() => navigate('/')}>
          🛒 ShopEasy
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          <button 
            onClick={() => navigate('/')} 
            style={styles.navButton}
          >
            Home
          </button>

          {user ? (
            <>
              <button 
                onClick={() => navigate('/orders')} 
                style={styles.navButton}
              >
                My Orders
              </button>
              <button 
                onClick={() => navigate('/cart')} 
                style={styles.cartButton}
              >
                🛒 Cart ({cartCount})
              </button>
              <div style={styles.userInfo}>
                Hi, {user.name}
              </div>
              <button 
                onClick={handleLogout} 
                style={styles.logoutButton}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate('/cart')} 
                style={styles.cartButton}
              >
                🛒 Cart ({cartCount})
              </button>
              <button 
                onClick={() => navigate('/login')} 
                style={styles.loginButton}
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/register')} 
                style={styles.registerButton}
              >
                Register
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#4CAF50',
    padding: '15px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    cursor: 'pointer'
  },
  nav: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  navButton: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.2s'
  },
  cartButton: {
    padding: '8px 16px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  loginButton: {
    padding: '8px 20px',
    backgroundColor: 'white',
    color: '#4CAF50',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  registerButton: {
    padding: '8px 20px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid white',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  userInfo: {
    color: 'white',
    fontSize: '16px',
    marginLeft: '10px'
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};

export default Header;