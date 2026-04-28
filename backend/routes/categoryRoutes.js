const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesByName,
  getCategoriesByModel,
  getCategoriesByYear,
  getCategoriesByFuelType,
  searchCategories,
  getFuelTypes,
  getYears
} = require('../controllers/categoryController');

// GET /api/categories - Get all categories
router.get('/', getAllCategories);

// GET /api/categories/search - Search categories
router.get('/search', searchCategories);

// GET /api/categories/fuel-types - Get all unique fuel types
router.get('/fuel-types', getFuelTypes);

// GET /api/categories/years - Get all unique years
router.get('/years', getYears);

// GET /api/categories/name/:name - Get categories by name
router.get('/name/:name', getCategoriesByName);

// GET /api/categories/model/:model - Get categories by model
router.get('/model/:model', getCategoriesByModel);

// GET /api/categories/year/:year - Get categories by year
router.get('/year/:year', getCategoriesByYear);

// GET /api/categories/fuel-type/:fuelType - Get categories by fuel type
router.get('/fuel-type/:fuelType', getCategoriesByFuelType);

// GET /api/categories/:id - Get category by ID
router.get('/:id', getCategoryById);

// POST /api/categories - Create new category
router.post('/', createCategory);

// PUT /api/categories/:id - Update category
router.put('/:id', updateCategory);

// DELETE /api/categories/:id - Delete category
router.delete('/:id', deleteCategory);

module.exports = router;
