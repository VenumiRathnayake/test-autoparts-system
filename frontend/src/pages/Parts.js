import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { categoryAPI } from "../services/api";
import "../styles/Pages.css";

const CarsPage = ({ carsData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAll();
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load categories");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Use props carsData if passed, else fallback to categories from backend
  const cars = carsData || categories.map(category => ({
    id: category._id,
    name: category.name,
    model: category.model,
    year: category.year,
    fuel: category.fuelType,
    image: category.image || "/assets/images/hero-1.jpg",
  }));

  const filteredCars = cars.filter((car) =>
    car.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="cars-page">
        <div className="text-center">
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cars-page">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="cars-page">
      <div className="cars-page__header">
        <h1>Browse Vehicle Categories</h1>
        <p>Choose a vehicle category to view matching spare parts faster.</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="cars-grid">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <article key={car.id} className="car-card">
              <div className="car-image">
                <img
                  src={car.image.startsWith('http') ? car.image : `${process.env.PUBLIC_URL}${car.image}`}
                  alt={car.name}
                />
              </div>

              <div className="car-card__body">
                <div className="car-card__eyebrow">Vehicle Category</div>
                <h3>{car.name}</h3>
                <p className="car-card__meta">
                  {car.model} • {car.year} • {car.fuel}
                </p>
                <Link
                  to={`/shop-parts/${car.name}`}
                  state={{ categoryData: car }}
                  className="btn btn-primary"
                >
                  View Parts
                </Link>
              </div>
            </article>
          ))
        ) : (
          <p className="cars-grid__empty">No categories found.</p>
        )}
      </div>
    </div>
  );
};

export default CarsPage;
