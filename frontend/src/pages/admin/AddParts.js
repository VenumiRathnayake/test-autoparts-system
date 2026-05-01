import React, { useState, useEffect } from "react";
import { partsAPI, categoryAPI, vendorAPI } from "../../services/api";

const AddParts = () => {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [vendor, setVendor] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories and vendors from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, vendorsResponse] = await Promise.all([
          categoryAPI.getAll(),
          vendorAPI.getAll()
        ]);
        setCategories(categoriesResponse.data);
        setVendors(vendorsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imagePath || !description || !category || !vendor) {
      alert("Please fill in all fields.");
      return;
    }

    const partData = {
      name,
      brand,
      price,
      image: imagePath,
      description,
      category,
      vendor,
      quantity: parseInt(quantity, 10) || 0
    };

    try {
      const response = await partsAPI.create(partData);

      if (response.status === 201 || response.status === 200) {
        alert("Part added successfully!");
        setName("");
        setBrand("");
        setPrice("");
        setImagePath("");
        setDescription("");
        setCategory("");
        setVendor("");
        setQuantity(0);
      }
    } catch (error) {
      console.error("Error adding part:", error);
      alert("Failed to add part.");
    }
  };

  return (
    <div className="add-part-page">
      <div className="add-part-card">
        <h2>Add New Part</h2>
        <form onSubmit={handleSubmit} className="add-part-form">
          <div className="form-group">
            <label>Part Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Air Filter"
            />
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="0"
              placeholder="e.g. 10"
            />
          </div>

          <div className="form-group">
            <label>Brand</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
              placeholder="e.g. Bosch"
            />
          </div>

          <div className="form-group">
            <label>Price (LKR)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="e.g. 4500"
            />
          </div>

          <div className="form-group">
            <label>Image Path / URL</label>
            <input
              type="text"
              value={imagePath}
              onChange={(e) => setImagePath(e.target.value)}
              required
              placeholder="e.g. /images/parts/air-filter.jpg"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Write a brief description about the part"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Category</label>
            {loading ? (
              <select className="form-control" disabled>
                <option>Loading categories...</option>
              </select>
            ) : (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name} - {cat.model} ({cat.year})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label>Vendor</label>
            {loading ? (
              <select className="form-control" disabled>
                <option>Loading vendors...</option>
              </select>
            ) : (
              <select
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="form-control"
                required
              >
                <option value="">Select a vendor</option>
                {vendors.map((vend) => (
                  <option key={vend._id} value={vend._id}>
                    {vend.businessName} - {vend.ownerName}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button type="submit" className="btn btn-success">
            Add Part
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddParts;
