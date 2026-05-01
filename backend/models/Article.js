const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Article', articleSchema); 