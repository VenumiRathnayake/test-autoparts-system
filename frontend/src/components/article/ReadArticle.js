import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { articlesAPI } from "../../services/api";
import "../../styles/Components.css";

const ReadArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await articlesAPI.getById(id);
        setArticle(response.data);
      } catch (err) {
        console.error("Failed to fetch article", err);
      }
    };

    fetchArticle();
  }, [id]);

  if (article === null) {
    return (
      <div className="read-article-page">
        <div className="read-article-card read-article-card--state">
          <p className="read-article-status">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article._id) {
    return (
      <div className="read-article-page">
        <div className="read-article-card read-article-card--state">
          <p className="read-article-status">No article found.</p>
          <Link to="/education" className="read-article-back">
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="read-article-page">
      <div className="read-article-card">
        <div className="read-article-hero">
          <div className="read-article-copy">
            <div className="read-article-eyebrow">Educational Article</div>
            <h1 className="read-article-title">{article.title}</h1>
            <p className="read-article-intro">
              {article.shortDescription || article.description}
            </p>
            <div className="read-article-meta">
              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              <Link to="/education" className="read-article-back">
                Back to Articles
              </Link>
            </div>
          </div>

          {article.image_url && (
            <div className="read-article-media">
              <img src={article.image_url} alt={article.title} />
            </div>
          )}
        </div>

        <div className="read-article-section">
          <h2>Article Details</h2>
          <div className="read-article-content">
            {article.content || article.description}
          </div>
        </div>

        {article.videoUrl && (
          <div className="read-article-section">
            <h2>Watch Video</h2>
            <iframe
              src={article.videoUrl}
              title="Article Video"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        )}

        <div className="read-article-footer">
          <p>
            Published on {new Date(article.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReadArticle;
