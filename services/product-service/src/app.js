const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/product.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'product-service' });
});

// Routes
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Product Service running on http://localhost:${PORT}`);
});