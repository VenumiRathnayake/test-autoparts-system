const Article = require('../models/Article');

// Get all articles
const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find({}).sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching articles', error: error.message });
  }
};

// Get article by ID
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching article', error: error.message });
  }
};

// Create new article
const createArticle = async (req, res) => {
  try {
    const { title, shortDescription, content, image_url } = req.body;

    const article = new Article({
      title,
      shortDescription,
      content,
      image_url
    });

    const savedArticle = await article.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    res.status(500).json({ message: 'Error creating article', error: error.message });
  }
};

// Update article
const updateArticle = async (req, res) => {
  try {
    const { title, shortDescription, content, image_url } = req.body;
    
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      {
        title,
        shortDescription,
        content,
        image_url
      },
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error updating article', error: error.message });
  }
};

// Delete article
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting article', error: error.message });
  }
};

// Search articles
const searchArticles = async (req, res) => {
  try {
    const { query } = req.query;
    const searchRegex = new RegExp(query, 'i');
    
    const articles = await Article.find({
      $or: [
        { title: searchRegex },
        { shortDescription: searchRegex },
        { content: searchRegex }
      ]
    }).sort({ createdAt: -1 });
    
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Error searching articles', error: error.message });
  }
};

// Get recent articles (limit to 5)
const getRecentArticles = async (req, res) => {
  try {
    const articles = await Article.find({}).sort({ createdAt: -1 }).limit(5);
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent articles', error: error.message });
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  searchArticles,
  getRecentArticles
}; 