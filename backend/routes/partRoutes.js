const express = require('express');
const router = express.Router();
const {
  getAllParts,
  getPartById,
  createPart,
  updatePart,
  deletePart,
  getPartsByCategory,
  getPartsByVendor,
  searchParts,
  markPartAsSold,
  markMultiplePartsAsSold,
  getTopSellingParts
} = require('../controllers/partController');

// GET /api/parts - Get all parts
router.get('/', getAllParts);

// GET /api/parts/top - Get top selling parts
router.get('/top', getTopSellingParts);

// GET /api/parts/search - Search parts
router.get('/search', searchParts);

// GET /api/parts/category/:category - Get parts by category
router.get('/category/:category', getPartsByCategory);

// GET /api/parts/vendor/:vendorId - Get parts by vendor
router.get('/vendor/:vendorId', getPartsByVendor);

// GET /api/parts/:id - Get part by ID
router.get('/:id', getPartById);

// POST /api/parts - Create new part
router.post('/', createPart);

// PUT /api/parts/:id - Update part
router.put('/:id', updatePart);

// DELETE /api/parts/:id - Delete part
router.delete('/:id', deletePart);

// PUT /api/parts/:id/sold - Mark part as sold
router.put('/:id/sold', markPartAsSold);

// POST /api/parts/sold - Mark multiple parts as sold
router.post('/sold', markMultiplePartsAsSold);

module.exports = router; 