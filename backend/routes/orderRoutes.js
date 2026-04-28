const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrdersByUser,
  getOrderById,
  getAllOrders,
  getOrdersByVendor,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');

// POST /api/orders - Create new order
router.post('/', createOrder);

// GET /api/orders/user/:userId - Get orders by user
router.get('/user/:userId', getOrdersByUser);

// GET /api/orders/vendor/:vendorId - Get orders by vendor
router.get('/vendor/:vendorId', getOrdersByVendor);

// GET /api/orders/:id - Get order by ID
router.get('/:id', getOrderById);

// GET /api/orders - Get all orders (admin)
router.get('/', getAllOrders);

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', updateOrderStatus);

// DELETE /api/orders/:id - Delete order
router.delete('/:id', deleteOrder);

module.exports = router;
