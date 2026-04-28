import React, { useState, useEffect } from "react";
import { categoryAPI } from "../../services/api";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    model: "",
    year: "",
    fuelType: "",
    image: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setMessage("Failed to load categories");
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category._id);
    setEditForm({
      name: category.name,
      model: category.model,
      year: category.year.toString(),
      fuelType: category.fuelType,
      image: category.image,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const categoryData = {
        name: editForm.name,
        model: editForm.model,
        year: parseInt(editForm.year),
        fuelType: editForm.fuelType,
        image: editForm.image,
      };

      await categoryAPI.update(editingCategory, categoryData);
      setMessage("Category updated successfully!");
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      setMessage("Failed to update category");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await categoryAPI.delete(id);
        setMessage("Category deleted successfully!");
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
        setMessage("Failed to delete category");
      }
    }
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditForm({
      name: "",
      model: "",
      year: "",
      fuelType: "",
      image: "",
    });
  };

  if (loading) {
    return (
      <div className="admin-manage-categories container mt-5">
        <div className="text-center">
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-manage-categories container mt-5">
      <h2>Manage Categories</h2>
      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      <div className="row">
        {categories.map((category) => (
          <div key={category._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card">
              <div className="card-img-top" style={{ height: "200px", overflow: "hidden" }}>
                <img
                  src={category.image.startsWith('http') ? category.image : `${process.env.PUBLIC_URL}${category.image}`}
                  alt={category.name}
                  className="img-fluid"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = `${process.env.PUBLIC_URL}/assets/images/hero-1.jpg`;
                  }}
                />
              </div>
              <div className="card-body">
                {editingCategory === category._id ? (
                  <form onSubmit={handleUpdate}>
                    <div className="mb-2">
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="form-control form-control-sm"
                        placeholder="Category Name"
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        type="text"
                        name="model"
                        value={editForm.model}
                        onChange={handleEditChange}
                        className="form-control form-control-sm"
                        placeholder="Model"
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        type="number"
                        name="year"
                        value={editForm.year}
                        onChange={handleEditChange}
                        className="form-control form-control-sm"
                        placeholder="Year"
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <select
                        name="fuelType"
                        value={editForm.fuelType}
                        onChange={handleEditChange}
                        className="form-select form-select-sm"
                        required
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Electric">Electric</option>
                        <option value="CNG">CNG</option>
                        <option value="LPG">LPG</option>
                      </select>
                    </div>
                    <div className="mb-2">
                      <input
                        type="url"
                        name="image"
                        value={editForm.image}
                        onChange={handleEditChange}
                        className="form-control form-control-sm"
                        placeholder="Image URL"
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-success btn-sm">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="btn btn-secondary btn-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h5 className="card-title">{category.name}</h5>
                    <p className="card-text">
                      <strong>Model:</strong> {category.model}<br />
                      <strong>Year:</strong> {category.year}<br />
                      <strong>Fuel:</strong> {category.fuelType}
                    </p>
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="btn btn-primary btn-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-5">
          <p>No categories found. Add some categories to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
