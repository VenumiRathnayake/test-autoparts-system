const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'sold'],
    default: 'available'
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  soldCount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Part', partSchema); 