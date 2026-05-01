const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const vendorSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  ownerName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  companyRegistrationNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  outletLocation: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined'],
    default: 'pending'
  },
  approvedAt: {
    type: Date,
    default: null
  },
  approvedBy: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving
vendorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Vendor', vendorSchema); 