const Part = require('../models/Part');

// Get all parts
const getAllParts = async (req, res) => {
  try {
    const parts = await Part.find({ status: 'available' }).populate('vendor', 'businessName ownerName');
    res.status(200).json(parts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parts', error: error.message });
  }
};

// Get part by ID
const getPartById = async (req, res) => {
  try {
    const part = await Part.findById(req.params.id).populate('vendor', 'businessName ownerName');
    if (!part) {
      return res.status(404).json({ message: 'Part not found' });
    }
    res.status(200).json(part);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching part', error: error.message });
  }
};

// Create new part
const createPart = async (req, res) => {
  try {
    const { name, brand, price, image, description, category, vendor, quantity } = req.body;

    const part = new Part({
      name,
      brand,
      price,
      image,
      description,
      category,
      vendor,
      quantity: typeof quantity === 'number' ? quantity : parseInt(quantity, 10) || 0
    });

    const savedPart = await part.save();
    const populatedPart = await Part.findById(savedPart._id).populate('vendor', 'businessName ownerName');
    
    res.status(201).json(populatedPart);
  } catch (error) {
    res.status(500).json({ message: 'Error creating part', error: error.message });
  }
};

// Update part
const updatePart = async (req, res) => {
  try {
    const { name, brand, price, image, description, category, vendor, quantity } = req.body;
    
    const part = await Part.findByIdAndUpdate(
      req.params.id,
      {
        name,
        brand,
        price,
        image,
        description,
        category,
        vendor,
        ...(quantity !== undefined ? { quantity: typeof quantity === 'number' ? quantity : parseInt(quantity, 10) || 0 } : {})
      },
      { new: true, runValidators: true }
    ).populate('vendor', 'businessName ownerName');

    if (!part) {
      return res.status(404).json({ message: 'Part not found' });
    }

    res.status(200).json(part);
  } catch (error) {
    res.status(500).json({ message: 'Error updating part', error: error.message });
  }
};

// Delete part
const deletePart = async (req, res) => {
  try {
    const part = await Part.findByIdAndDelete(req.params.id);
    if (!part) {
      return res.status(404).json({ message: 'Part not found' });
    }
    res.status(200).json({ message: 'Part deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting part', error: error.message });
  }
};

// Get parts by category
const getPartsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const parts = await Part.find({ category, status: 'available' }).populate('vendor', 'businessName ownerName');
    res.status(200).json(parts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parts by category', error: error.message });
  }
};

// Get parts by vendor
const getPartsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const parts = await Part.find({ vendor: vendorId, status: 'available' }).populate('vendor', 'businessName ownerName');
    res.status(200).json(parts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parts by vendor', error: error.message });
  }
};

// Search parts
const searchParts = async (req, res) => {
  try {
    const { query } = req.query;
    const searchRegex = new RegExp(query, 'i');
    
    const parts = await Part.find({
      status: 'available',
      $or: [
        { name: searchRegex },
        { brand: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ]
    }).populate('vendor', 'businessName ownerName');
    
    res.status(200).json(parts);
  } catch (error) {
    res.status(500).json({ message: 'Error searching parts', error: error.message });
  }
};

// Mark part as sold (decrement quantity by 1 and increment soldCount)
const markPartAsSold = async (req, res) => {
  try {
    const { id } = req.params;

    const part = await Part.findById(id).populate('vendor', 'businessName ownerName');

    if (!part) {
      return res.status(404).json({ message: 'Part not found' });
    }

    if (part.quantity <= 0) {
      return res.status(400).json({ message: 'No stock available for this part' });
    }

    part.quantity = part.quantity - 1;
    part.soldCount = (part.soldCount || 0) + 1;
    if (part.quantity === 0) {
      part.status = 'sold';
    }
    await part.save();

    res.status(200).json({ message: 'Part marked as sold successfully', part });
  } catch (error) {
    res.status(500).json({ message: 'Error marking part as sold', error: error.message });
  }
};

// Mark multiple parts as sold (each decremented by 1)
const markMultiplePartsAsSold = async (req, res) => {
  try {
    const { partIds } = req.body;
    
    if (!partIds || !Array.isArray(partIds) || partIds.length === 0) {
      return res.status(400).json({ message: 'Part IDs array is required' });
    }

    const parts = await Part.find({ _id: { $in: partIds } });
    if (!parts || parts.length === 0) {
      return res.status(404).json({ message: 'No parts found' });
    }

    let modifiedCount = 0;
    for (const part of parts) {
      if (part.quantity > 0) {
        part.quantity = part.quantity - 1;
        part.soldCount = (part.soldCount || 0) + 1;
        if (part.quantity === 0) {
          part.status = 'sold';
        }
        await part.save();
        modifiedCount++;
      }
    }

    res.status(200).json({ 
      message: `${modifiedCount} parts marked as sold successfully`,
      modifiedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error marking parts as sold', error: error.message });
  }
};

// Get top 4 selling parts by soldCount (only available)
const getTopSellingParts = async (req, res) => {
  try {
    const parts = await Part.find({ status: 'available' })
      .sort({ soldCount: -1, createdAt: -1 })
      .limit(4)
      .populate('vendor', 'businessName ownerName');
    res.status(200).json(parts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top selling parts', error: error.message });
  }
};

module.exports = {
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
}; 