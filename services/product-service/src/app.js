const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const productRoutes = require('./routes/product.routes');

// Create Express app
const app = express();

// Middleware (things that run before your routes)
app.use(helmet());           // Security headers
app.use(cors());             // Allow requests from browsers
app.use(express.json());     // Parse JSON in request body
app.use(express.urlencoded({ extended: true })); // Parse form data

// Health check endpoint (to test if server is running)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'product-service',
    timestamp: new Date().toISOString()
  });
});

// Use product routes
app.use('/api/products', productRoutes);

// 404 handler (if route doesn't exist)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (if something breaks)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Product Service running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
});