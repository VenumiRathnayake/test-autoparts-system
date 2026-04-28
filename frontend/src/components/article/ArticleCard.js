import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { articlesAPI } from "../../services/api";
import "../../styles/Components.css";

const ArticleCard = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await articlesAPI.getAll();
        setArticles(response.data);
      } catch (err) {
        console.error("Error fetching articles:", err);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="edu-links">
      {articles.map((article) => (
        <div key={article._id} className="edu-card">
          <img src={article.image_url} alt={article.title} />
          <h3>{article.title}</h3>
          <p>{article.shortDescription}</p>
          <Link to={`/education/${article._id}`} className="edu-link">
            Read Article
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ArticleCard;
