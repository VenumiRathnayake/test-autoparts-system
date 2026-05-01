const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get all vendors
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({});
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendors', error: error.message });
  }
};

// Get vendor by ID
const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendor', error: error.message });
  }
};

// Create new vendor
const createVendor = async (req, res) => {
  try {
    const { businessName, ownerName, email, mobileNumber, companyRegistrationNumber, outletLocation, password } = req.body;

    // Check if vendor already exists with same email or registration number
    const existingVendor = await Vendor.findOne({
      $or: [
        { email },
        { companyRegistrationNumber }
      ]
    });
    
    if (existingVendor) {
      return res.status(400).json({ message: 'Vendor with this email or registration number already exists' });
    }

    const vendor = new Vendor({
      businessName,
      ownerName,
      email,
      mobileNumber,
      companyRegistrationNumber,
      outletLocation,
      password
    });

    const savedVendor = await vendor.save();
    
    // Return vendor data without password
    const vendorResponse = savedVendor.toObject();
    delete vendorResponse.password;
    
    res.status(201).json(vendorResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error creating vendor', error: error.message });
  }
};

// Update vendor
const updateVendor = async (req, res) => {
  try {
    const { businessName, ownerName, email, mobileNumber, companyRegistrationNumber, outletLocation } = req.body;
    
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      {
        businessName,
        ownerName,
        email,
        mobileNumber,
        companyRegistrationNumber,
        outletLocation
      },
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ message: 'Error updating vendor', error: error.message });
  }
};

// Delete vendor
const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.status(200).json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting vendor', error: error.message });
  }
};

// Login vendor
const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find vendor by email
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, vendor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { vendorId: vendor._id, email: vendor.email },
      process.env.JWT_SECRET || 'your-secret-key-here',
      { expiresIn: '24h' }
    );

    // Return vendor data (without password) and token
    const vendorResponse = vendor.toObject();
    delete vendorResponse.password;

    res.status(200).json({
      message: 'Login successful',
      token,
      vendor: vendorResponse
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};

// Approve vendor
const approveVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;

    const vendor = await Vendor.findByIdAndUpdate(
      id,
      {
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: approvedBy || 'Admin'
      },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.status(200).json({ message: 'Vendor approved successfully', vendor });
  } catch (error) {
    res.status(500).json({ message: 'Error approving vendor', error: error.message });
  }
};

// Decline vendor
const declineVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;

    const vendor = await Vendor.findByIdAndUpdate(
      id,
      {
        status: 'declined',
        approvedAt: new Date(),
        approvedBy: approvedBy || 'Admin'
      },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.status(200).json({ message: 'Vendor declined successfully', vendor });
  } catch (error) {
    res.status(500).json({ message: 'Error declining vendor', error: error.message });
  }
};

// Get vendors by status
const getVendorsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const vendors = await Vendor.find({ status }).sort({ createdAt: -1 });
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendors by status', error: error.message });
  }
};

module.exports = {
  getAllVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
  loginVendor,
  approveVendor,
  declineVendor,
  getVendorsByStatus
}; 