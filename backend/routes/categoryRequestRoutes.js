const express = require('express');
const router = express.Router();
const {
  createCategoryRequest,
  getAllCategoryRequests,
  getCategoryRequestsByVendor,
  getCategoryRequestById,
  approveCategoryRequest,
  declineCategoryRequest,
  deleteCategoryRequest
} = require('../controllers/categoryRequestController');

// POST /api/category-requests - Create new category request
router.post('/', createCategoryRequest);

// GET /api/category-requests - Get all category requests (admin)
router.get('/', getAllCategoryRequests);

// GET /api/category-requests/vendor/:vendorId - Get category requests by vendor
router.get('/vendor/:vendorId', getCategoryRequestsByVendor);

// GET /api/category-requests/:id - Get category request by ID
router.get('/:id', getCategoryRequestById);

// PUT /api/category-requests/:id/approve - Approve category request
router.put('/:id/approve', approveCategoryRequest);

// PUT /api/category-requests/:id/decline - Decline category request
router.put('/:id/decline', declineCategoryRequest);

// DELETE /api/category-requests/:id - Delete category request
router.delete('/:id', deleteCategoryRequest);

module.exports = router;
