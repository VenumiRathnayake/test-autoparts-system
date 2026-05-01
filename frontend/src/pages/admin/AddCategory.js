import React, { useState } from "react";
import { categoryAPI } from "../../services/api";

const AddCategory = () => {
  const [car, setCar] = useState({
    name: "",
    model: "",
    year: "",
    fuelType: "",
    image: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const categoryData = {
        name: car.name,
        model: car.model,
        year: parseInt(car.year),
        fuelType: car.fuelType,
        image: car.image || "/assets/images/hero-1.jpg"
      };

      const response = await categoryAPI.create(categoryData);

      if (response.status === 201) {
        setMessage("Category added successfully!");
        setCar({
          name: "",
          model: "",
          year: "",
          fuelType: "",
          image: "",
        });
      }
    } catch (error) {
      console.error("Error adding category:", error);
      setMessage("Failed to add category. Try again.");
    }
  };

  return (
    <div className="admin-add-category">
      <h2>Add New Category</h2>
      {message && (
        <div
          className={`admin-add-category__alert ${
            message.includes("successfully")
              ? "admin-add-category__alert--success"
              : "admin-add-category__alert--error"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-add-category__form">
        <div className="form-group">
          <label className="form-label">Category Name</label>
          <input
            type="text"
            name="name"
            value={car.name}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter category name"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Model</label>
          <input
            type="text"
            name="model"
            value={car.model}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter car model"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Year</label>
          <input
            type="number"
            name="year"
            value={car.year}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter car year"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Fuel Type</label>
          <select
            name="fuelType"
            value={car.fuelType}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select fuel type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Electric</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Category Image URL</label>
          <input
            type="url"
            name="image"
            value={car.image}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter image URL (e.g., https://example.com/image.jpg or /assets/images/hero-1.jpg)"
          />
          <div className="admin-add-category__hint">
            Enter a full URL (https://...) or a path to an image in the assets folder (e.g., /assets/images/hero-1.jpg)
          </div>
        </div>

        <button type="submit" className="btn btn-success w-100">
          Add Category
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
