const express = require('express');
const router = express.Router();
const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  searchArticles,
  getRecentArticles
} = require('../controllers/articleController');

// GET /api/articles - Get all articles
router.get('/', getAllArticles);

// GET /api/articles/recent - Get recent articles
router.get('/recent', getRecentArticles);

// GET /api/articles/search - Search articles
router.get('/search', searchArticles);

// GET /api/articles/:id - Get article by ID
router.get('/:id', getArticleById);

// POST /api/articles - Create new article
router.post('/', createArticle);

// PUT /api/articles/:id - Update article
router.put('/:id', updateArticle);

// DELETE /api/articles/:id - Delete article
router.delete('/:id', deleteArticle);

module.exports = router; 