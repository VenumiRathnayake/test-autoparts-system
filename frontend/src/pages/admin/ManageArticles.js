import React, { useState, useEffect } from "react";
import { articlesAPI } from "../../services/api";
import UpdateArticleModal from "../../components/shop/UpdateArticleModal";

const ManageArticles = () => {
  const [articles, setArticles] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await articlesAPI.getAll();
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  const handleDelete = async (articleId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this article?"
    );
    if (confirmDelete) {
      try {
        const response = await articlesAPI.delete(articleId);
        if (response.status === 200) {
          setArticles(articles.filter((a) => a._id !== articleId));
          alert("Article deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting article:", error);
        alert("Failed to delete article.");
      }
    }
  };

  const handleUpdate = (article) => {
    setSelectedArticle(article);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (articleId, updateData) => {
    try {
      const response = await articlesAPI.update(articleId, updateData);
      if (response.status === 200) {
        setArticles(articles.map(article => 
          article._id === articleId ? response.data : article
        ));
        alert("Article updated successfully!");
      }
    } catch (error) {
      console.error("Error updating article:", error);
      throw error; // Re-throw to let modal handle the error
    }
  };

  const handleCloseModal = () => {
    setShowUpdateModal(false);
    setSelectedArticle(null);
  };

  return (
    <div className="manage-articles">
      <h2>Admin Panel - Manage Articles</h2>
      <div className="article-list">
        {articles.length > 0 ? (
          articles.map((article) => (
            <div key={article._id} className="article-card">
              <img
                src={article.image_url} // Use image_url to match backend model
                alt={article.title}
              />
              <h3>{article.title}</h3>
              <p>{article.shortDescription}</p>
              <div className="article-actions">
                <button
                  className="update-btn"
                  onClick={() => handleUpdate(article)}
                >
                  Update
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(article._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No articles available.</p>
        )}
      </div>

      {/* Update Article Modal */}
      <UpdateArticleModal
        show={showUpdateModal}
        handleClose={handleCloseModal}
        article={selectedArticle}
        onUpdate={handleUpdateSubmit}
      />
    </div>
  );
};

export default ManageArticles;
