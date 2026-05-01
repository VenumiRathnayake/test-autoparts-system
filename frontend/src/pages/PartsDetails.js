import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import ShopParts from "../components/shop/ShopParts";
import { partsAPI } from "../services/api";
import "../styles/Pages.css";

const PartsDetailsPage = () => {
  const { carId } = useParams();
  const location = useLocation();

  // Get categoryData passed via state from Parts page
  const categoryData = location.state?.categoryData || null;

  const [car, setCar] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredParts, setFilteredParts] = useState([]);
  const [allParts, setAllParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Set car data from categoryData
  useEffect(() => {
    if (categoryData) {
      setCar(categoryData);
    }
  }, [categoryData]);

  // Fetch parts for this category
  useEffect(() => {
    const fetchParts = async () => {
      try {
        setLoading(true);
        console.log('Fetching parts for category:', carId); // Debug log
        const response = await partsAPI.getByCategory(carId);
        console.log('Fetched parts:', response.data); // Debug log
        setAllParts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching parts:', err); // Debug log
        setError("Failed to load parts");
        setLoading(false);
      }
    };

    if (carId) {
      fetchParts();
    }
  }, [carId]);

  // Filter parts by search
  useEffect(() => {
    if (!searchQuery) {
      setFilteredParts([]);
      return;
    }
    console.log('Filtering parts for search:', searchQuery); // Debug log
    const results = allParts.filter((part) =>
      part.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log('Filtered results:', results); // Debug log
    setFilteredParts(results);
  }, [searchQuery, allParts]);

  if (loading) return <div className="text-center py-5"><p>Loading parts...</p></div>;
  if (error) return <p>Error: {error}</p>;
  if (!car) return <p>Category not found...</p>;

  return (
    <div className="parts-details-page container">
      {/* Car Details */}
      <div className="car-details mb-4">
        <div className="car-image mb-3">
          <img
            src={car.image.startsWith('http') ? car.image : `${process.env.PUBLIC_URL}${car.image}`}
            alt={car.name}
            className="img-fluid"
          />
        </div>
        <div className="car-info">
          <h2>{car.name}</h2>
          <p>Model: {car.model}</p>
          <p>Year: {car.year}</p>
          <p>Fuel Type: {car.fuel}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="parts-search-bar mb-4">
        <input
          type="text"
          placeholder="Search for parts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

             {/* Shop Parts */}
       {searchQuery && filteredParts.length > 0 ? (
         <ShopParts parts={filteredParts} />
       ) : searchQuery && filteredParts.length === 0 ? (
         <p>No parts found for "{searchQuery}"</p>
       ) : allParts.length > 0 ? (
         <ShopParts parts={allParts} />
       ) : (
         <p>No parts available for this category</p>
       )}
       
       
    </div>
  );
};

export default PartsDetailsPage;
