import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

  if (article === null) return <p>Loading...</p>;
  if (!article._id) return <p>No article found.</p>;

  return (
    <div className="read-article-page">
      <div className="read-article-card">
        <h1 className="read-article-title">{article.title}</h1>
        <p className="read-article-intro">{article.shortDescription}</p>

        <div className="read-article-section">
          {article.image_url && (
            <img src={article.image_url} alt={article.title} />
          )}
        </div>

        <div className="read-article-section">
          <h2>Full Article</h2>
          <div>{article.content}</div>
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

        <div className="read-article-section">
          <p style={{ color: "#999", fontSize: "14px" }}>
            Created at: {new Date(article.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReadArticle;
