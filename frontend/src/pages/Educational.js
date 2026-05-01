import React from "react";
import ArticleCard from "../components/article/ArticleCard";
import "../styles/Pages.css";

const Education = () => {
  return (
    <div className="education-page">
      <h1 className="edu-title">Auto Care Tips & Guides</h1>
      <p className="edu-intro">
        Explore practical articles about maintenance, common part issues, and
        smarter ways to keep your vehicle in top condition.
      </p>

      <div className="edu-section">
        <h2>Latest Articles</h2>
        <ArticleCard />
      </div>
    </div>
  );
};

export default Education;
