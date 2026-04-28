const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  fuelType: {
    type: String,
    required: true,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG'],
    trim: true
  },
  image: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique combinations
categorySchema.index({ name: 1, model: 1, year: 1, fuelType: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
