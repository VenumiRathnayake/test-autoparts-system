import React from "react";
import ArticleCard from "../components/article/ArticleCard";
import "../styles/Pages.css";

const Education = () => {
  return (
    <div className="education-page">
      <h1 className="edu-title">Education - Learn About Cars</h1>
      <p className="edu-intro">
        Welcome to the educational section! Here, you will find detailed
        articles about the history of cars, the different types of cars, and key
        vehicle parts. Click on any of the articles below to learn more.
      </p>

      <div className="edu-section">
        <h2>📚 Articles</h2>
        <ArticleCard />
      </div>
    </div>
  );
};

export default Education;
