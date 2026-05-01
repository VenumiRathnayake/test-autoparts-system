const mongoose = require('mongoose');

const categoryRequestSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  categoryName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined'],
    default: 'pending'
  },
  adminResponse: {
    type: String,
    trim: true
  },
  processedAt: {
    type: Date,
    default: null
  },
  processedBy: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
categoryRequestSchema.index({ vendor: 1, status: 1 });
categoryRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('CategoryRequest', categoryRequestSchema);
