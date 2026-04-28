const express = require('express');
const router = express.Router();
const {
  getAllVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
  loginVendor,
  approveVendor,
  declineVendor,
  getVendorsByStatus
} = require('../controllers/vendorController');

// POST /api/vendors/login - Login vendor
router.post('/login', loginVendor);

// GET /api/vendors - Get all vendors
router.get('/', getAllVendors);

// GET /api/vendors/:id - Get vendor by ID
router.get('/:id', getVendorById);

// POST /api/vendors - Create new vendor
router.post('/', createVendor);

// PUT /api/vendors/:id - Update vendor
router.put('/:id', updateVendor);

// DELETE /api/vendors/:id - Delete vendor
router.delete('/:id', deleteVendor);

// PUT /api/vendors/:id/approve - Approve vendor
router.put('/:id/approve', approveVendor);

// PUT /api/vendors/:id/decline - Decline vendor
router.put('/:id/decline', declineVendor);

// GET /api/vendors/status/:status - Get vendors by status
router.get('/status/:status', getVendorsByStatus);

module.exports = router; 