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
      <div className="cars-page container">
        <div className="text-center">
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cars-page container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="cars-page container">
      <div className="search-bar mb-4">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="cars-grid row">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <div
              key={car.id}
              className="car-card col-lg-3 col-md-4 col-sm-6 mb-4"
            >
              <div className="car-image">
                <img
                  src={car.image.startsWith('http') ? car.image : `${process.env.PUBLIC_URL}${car.image}`}
                  alt={car.name}
                  className="img-fluid"
                />
              </div>
              <h3>{car.name}</h3>
              <p className="text-muted">{car.model} - {car.year} - {car.fuel}</p>
              <Link
                to={`/shop-parts/${car.name}`}
                state={{ categoryData: car }}
                className="btn btn-primary"
              >
                View Parts
              </Link>
            </div>
          ))
        ) : (
          <p>No categories found.</p>
        )}
      </div>
    </div>
  );
};

export default CarsPage;
