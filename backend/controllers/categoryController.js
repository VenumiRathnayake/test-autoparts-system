const Category = require('../models/Category');

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1, year: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
};

// Create new category
const createCategory = async (req, res) => {
  try {
    const { name, model, year, fuelType, image } = req.body;

    // Check if category already exists with same combination
    const existingCategory = await Category.findOne({
      name,
      model,
      year,
      fuelType
    });
    
    if (existingCategory) {
      return res.status(400).json({ 
        message: 'Category with this name, model, year, and fuel type combination already exists' 
      });
    }

    const category = new Category({
      name,
      model,
      year,
      fuelType,
      image
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { name, model, year, fuelType, image } = req.body;
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        model,
        year,
        fuelType,
        image
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};

// Get categories by name
const getCategoriesByName = async (req, res) => {
  try {
    const { name } = req.params;
    const categories = await Category.find({ 
      name: { $regex: name, $options: 'i' } 
    }).sort({ year: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories by name', error: error.message });
  }
};

// Get categories by model
const getCategoriesByModel = async (req, res) => {
  try {
    const { model } = req.params;
    const categories = await Category.find({ 
      model: { $regex: model, $options: 'i' } 
    }).sort({ year: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories by model', error: error.message });
  }
};

// Get categories by year
const getCategoriesByYear = async (req, res) => {
  try {
    const { year } = req.params;
    const categories = await Category.find({ year: parseInt(year) }).sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories by year', error: error.message });
  }
};

// Get categories by fuel type
const getCategoriesByFuelType = async (req, res) => {
  try {
    const { fuelType } = req.params;
    const categories = await Category.find({ 
      fuelType: { $regex: fuelType, $options: 'i' } 
    }).sort({ name: 1, year: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories by fuel type', error: error.message });
  }
};

// Search categories
const searchCategories = async (req, res) => {
  try {
    const { query } = req.query;
    const searchRegex = new RegExp(query, 'i');
    
    const categories = await Category.find({
      $or: [
        { name: searchRegex },
        { model: searchRegex },
        { fuelType: searchRegex }
      ]
    }).sort({ name: 1, year: -1 });
    
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error searching categories', error: error.message });
  }
};

// Get unique fuel types
const getFuelTypes = async (req, res) => {
  try {
    const fuelTypes = await Category.distinct('fuelType');
    res.status(200).json(fuelTypes.sort());
  } catch (error) {
    res.status(500).json({ message: 'Error fetching fuel types', error: error.message });
  }
};

// Get unique years
const getYears = async (req, res) => {
  try {
    const years = await Category.distinct('year');
    res.status(200).json(years.sort((a, b) => b - a)); // Sort descending
  } catch (error) {
    res.status(500).json({ message: 'Error fetching years', error: error.message });
  }
};

module.exports = {
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
};
