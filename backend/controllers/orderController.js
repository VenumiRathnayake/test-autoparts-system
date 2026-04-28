const mongoose = require('mongoose');
const Order = require('../models/Order');
const Part = require('../models/Part');

// Create new order
const createOrder = async (req, res) => {
  try {
    const { user, items, shippingDetails, totalAmount } = req.body;

    console.log('Received order data:', { user, items, shippingDetails, totalAmount });

    // Validate required fields
    if (!user || !items || !shippingDetails || !totalAmount) {
      return res.status(400).json({ 
        message: 'Missing required fields: user, items, shippingDetails, totalAmount' 
      });
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items array is required and cannot be empty' });
    }

    // Validate user ID format
    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Validate each item
    for (const item of items) {
      if (!item.part || !item.quantity || !item.price) {
        return res.status(400).json({ message: 'Each item must have part, quantity, and price' });
      }
      if (!mongoose.Types.ObjectId.isValid(item.part)) {
        return res.status(400).json({ message: 'Invalid part ID format in items' });
      }
    }

    // Create the order
    const order = new Order({
      user,
      items,
      shippingDetails,
      totalAmount
    });

    const savedOrder = await order.save();
    
    // Populate the order with part and user details
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('user', 'name email')
      .populate({
        path: 'items.part',
        select: 'name brand price image category vendor',
        populate: {
          path: 'vendor',
          select: 'businessName ownerName'
        }
      });

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Get orders by user
const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const orders = await Order.find({ user: userId })
      .populate('user', 'name email')
      .populate({
        path: 'items.part',
        select: 'name brand price image category vendor',
        populate: {
          path: 'vendor',
          select: 'businessName ownerName'
        }
      })
      .sort({ createdAt: -1 }); // Most recent first

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user orders', error: error.message });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id)
      .populate('user', 'name email')
      .populate({
        path: 'items.part',
        select: 'name brand price image category vendor',
        populate: {
          path: 'vendor',
          select: 'businessName ownerName'
        }
      });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate({
        path: 'items.part',
        select: 'name brand price image category vendor',
        populate: {
          path: 'vendor',
          select: 'businessName ownerName'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get orders by vendor
const getOrdersByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    
    // Find orders that contain parts from this vendor
    const orders = await Order.find({
      'items.part': {
        $in: await Part.find({ vendor: vendorId }).distinct('_id')
      }
    })
      .populate('user', 'name email')
      .populate({
        path: 'items.part',
        select: 'name brand price image category vendor',
        populate: {
          path: 'vendor',
          select: 'businessName ownerName'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching vendor orders:', error);
    res.status(500).json({ message: 'Error fetching vendor orders', error: error.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ') 
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .populate({
        path: 'items.part',
        select: 'name brand price image category vendor',
        populate: {
          path: 'vendor',
          select: 'businessName ownerName'
        }
      });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findByIdAndDelete(id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrdersByUser,
  getOrderById,
  getAllOrders,
  getOrdersByVendor,
  updateOrderStatus,
  deleteOrder
};
