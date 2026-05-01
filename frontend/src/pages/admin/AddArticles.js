import React, { useState } from "react";
import { articlesAPI } from "../../services/api";

const AddArticles = () => {
  const [articleData, setArticleData] = useState({
    title: "",
    shortDescription: "",
    content: "",
  });

  const handleChange = (e) => {
    setArticleData({ ...articleData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const articlePayload = {
      title: articleData.title,
      shortDescription: articleData.shortDescription,
      content: articleData.content,
      image_url: articleData.imageUrl, // Use image_url to match backend model
    };

    try {
      await articlesAPI.create(articlePayload);
      alert("Article added successfully!");
      setArticleData({
        title: "",
        shortDescription: "",
        content: "",
        imageUrl: "",
      });
    } catch (error) {
      console.error("Error adding article:", error);
      alert("Failed to add article.");
    }
  };

  return (
    <div className="add-article-page">
      <div className="add-article-card">
        <h2>Add New Article</h2>
        <form onSubmit={handleSubmit} className="add-article-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={articleData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={articleData.imageUrl} // Bind the input to imageUrl
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Short Description</label>
            <textarea
              name="shortDescription"
              rows="3"
              value={articleData.shortDescription}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Full Content</label>
            <textarea
              name="content"
              rows="6"
              value={articleData.content}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-success">
            Add Article
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddArticles;
