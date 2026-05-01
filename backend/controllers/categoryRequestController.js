const CategoryRequest = require('../models/CategoryRequest');
const Category = require('../models/Category');

// Create new category request
const createCategoryRequest = async (req, res) => {
  try {
    const { categoryName, description } = req.body;
    const vendorId = req.user?.vendorId || req.body.vendorId; // Get from auth or body

    if (!vendorId) {
      return res.status(400).json({ message: 'Vendor ID is required' });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${categoryName}$`, 'i') } 
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    // Check if vendor already has a pending request for this category
    const existingRequest = await CategoryRequest.findOne({
      vendor: vendorId,
      categoryName: { $regex: new RegExp(`^${categoryName}$`, 'i') },
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request for this category' });
    }

    const categoryRequest = new CategoryRequest({
      vendor: vendorId,
      categoryName,
      description
    });

    const savedRequest = await categoryRequest.save();
    const populatedRequest = await CategoryRequest.findById(savedRequest._id)
      .populate('vendor', 'businessName ownerName email');

    res.status(201).json(populatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category request', error: error.message });
  }
};

// Get all category requests (admin)
const getAllCategoryRequests = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status) {
      query.status = status;
    }

    const requests = await CategoryRequest.find(query)
      .populate('vendor', 'businessName ownerName email outletLocation location')
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category requests', error: error.message });
  }
};

// Get category requests by vendor
const getCategoryRequestsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { status } = req.query;
    
    let query = { vendor: vendorId };
    if (status) {
      query.status = status;
    }

    const requests = await CategoryRequest.find(query)
      .populate('vendor', 'businessName ownerName email')
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendor category requests', error: error.message });
  }
};

// Get category request by ID
const getCategoryRequestById = async (req, res) => {
  try {
    const request = await CategoryRequest.findById(req.params.id)
      .populate('vendor', 'businessName ownerName email outletLocation location');

    if (!request) {
      return res.status(404).json({ message: 'Category request not found' });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category request', error: error.message });
  }
};

// Approve category request
const approveCategoryRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminResponse, processedBy } = req.body;

    const request = await CategoryRequest.findById(id)
      .populate('vendor', 'businessName ownerName email');

    if (!request) {
      return res.status(404).json({ message: 'Category request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request has already been processed' });
    }

    // Create the category
    const category = new Category({
      name: request.categoryName,
      model: 'General', // Default model
      year: new Date().getFullYear(), // Current year
      fuelType: 'Petrol', // Default fuel type
      image: '/assets/images/hero-1.jpg' // Default image
    });

    const savedCategory = await category.save();

    // Update the request
    request.status = 'approved';
    request.adminResponse = adminResponse || 'Category approved and created';
    request.processedAt = new Date();
    request.processedBy = processedBy || 'Admin';

    await request.save();

    res.status(200).json({
      message: 'Category request approved and category created',
      request,
      category: savedCategory
    });
  } catch (error) {
    res.status(500).json({ message: 'Error approving category request', error: error.message });
  }
};

// Decline category request
const declineCategoryRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminResponse, processedBy } = req.body;

    const request = await CategoryRequest.findById(id)
      .populate('vendor', 'businessName ownerName email');

    if (!request) {
      return res.status(404).json({ message: 'Category request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request has already been processed' });
    }

    // Update the request
    request.status = 'declined';
    request.adminResponse = adminResponse || 'Category request declined';
    request.processedAt = new Date();
    request.processedBy = processedBy || 'Admin';

    await request.save();

    res.status(200).json({
      message: 'Category request declined',
      request
    });
  } catch (error) {
    res.status(500).json({ message: 'Error declining category request', error: error.message });
  }
};

// Delete category request
const deleteCategoryRequest = async (req, res) => {
  try {
    const request = await CategoryRequest.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Category request not found' });
    }

    res.status(200).json({ message: 'Category request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category request', error: error.message });
  }
};

module.exports = {
  createCategoryRequest,
  getAllCategoryRequests,
  getCategoryRequestsByVendor,
  getCategoryRequestById,
  approveCategoryRequest,
  declineCategoryRequest,
  deleteCategoryRequest
};
