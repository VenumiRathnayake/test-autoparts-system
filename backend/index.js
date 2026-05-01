const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const partRoutes = require('./routes/partRoutes');
const articleRoutes = require('./routes/articleRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const categoryRequestRoutes = require('./routes/categoryRequestRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Spare Parts API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      vendors: '/api/vendors',
      parts: '/api/parts',
      articles: '/api/articles',
      categories: '/api/categories',
      orders: '/api/orders'
    }
  });
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/parts', partRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/category-requests', categoryRequestRoutes);
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 