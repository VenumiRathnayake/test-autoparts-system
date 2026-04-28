import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ShopCard from "./ShopCard";
import "../../styles/Components.css";

const mockParts = [
  {
    id: 1,
    name: "Brake Disc Rotors",
    price: 89.99,
    brand: "Bosch",
    vendor: "AutoZone",
    location: "Colombo",
    rating: 4.5,
    condition: "new",
    image: "/assets/images/hero-1.jpg",
  },
  {
    id: 2,
    name: "Oil Filter",
    price: 12.99,
    brand: "Mann Filter",
    vendor: "CarParts",
    location: "Battaramulla",
    rating: 4.2,
    condition: "new",
    image: "/assets/images/hero-2.jpg",
  },
  {
    id: 3,
    name: "Spark Plugs",
    price: 24.99,
    brand: "Delphi",
    vendor: "Local Vendor",
    location: "Dehiwala",
    rating: 4.7,
    condition: "reconditioned",
    image: "/assets/images/hero-3.jpg",
  },
  {
    id: 4,
    name: "Air Filter",
    price: 18.99,
    brand: "Bosch",
    vendor: "AutoZone",
    location: "Colombo",
    rating: 4.1,
    condition: "new",
    image: "/assets/images/hero-4.jpg",
  },
  {
    id: 5,
    name: "Fuel Pump",
    price: 129.99,
    brand: "Delphi",
    vendor: "CarParts",
    location: "Battaramulla",
    rating: 4.3,
    condition: "reconditioned",
    image: "/assets/images/home.jpg",
  },
  {
    id: 6,
    name: "Water Pump",
    price: 79.99,
    brand: "Bosch",
    vendor: "Local Vendor",
    location: "Dehiwala",
    rating: 4.6,
    condition: "new",
    image: "/assets/images/about-us.jpeg",
  },
];

const ShopParts = ({ parts: propParts }) => {
  const [filters, setFilters] = useState({
    category: [],
    price: [],
    brand: [],
    vendor: [],
    location: [],
    ratings: [],
  });
  const [sortBy, setSortBy] = useState("default");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  // Use propParts if provided, otherwise use mockParts
  const availableParts = propParts || mockParts || [];
  
  // Debug log
  console.log('ShopParts received parts:', propParts);
  console.log('Available parts:', availableParts);

  // Filter and sort parts
  const filteredParts = availableParts
    .filter((part) => {
      // Search filter
      if (
        searchTerm &&
        !part.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (filters.category.length > 0) {
        const partCategory = part.category || part.vehicle || 'General';
        if (!filters.category.includes(partCategory)) {
          return false;
        }
      }

      // Price filter
      if (filters.price.length > 0) {
        const priceMatch = filters.price.some((priceRange) => {
          switch (priceRange) {
            case "under-5000":
              return part.price < 5000;
            case "5000-50000":
              return part.price >= 5000 && part.price <= 50000;
            case "50000-100000":
              return part.price >= 50000 && part.price <= 100000;
            case "100000+":
              return part.price > 50000;
            default:
              return true;
          }
        });
        if (!priceMatch) return false;
      }

      // Custom price range filter
      if (filters.minPrice && filters.maxPrice) {
        const minPrice = parseFloat(filters.minPrice);
        const maxPrice = parseFloat(filters.maxPrice);
        if (part.price < minPrice || part.price > maxPrice) {
          return false;
        }
      } else if (filters.minPrice) {
        const minPrice = parseFloat(filters.minPrice);
        if (part.price < minPrice) {
          return false;
        }
      } else if (filters.maxPrice) {
        const maxPrice = parseFloat(filters.maxPrice);
        if (part.price > maxPrice) {
          return false;
        }
      }



       // Brand filter
       if (filters.brand.length > 0 && !filters.brand.includes(part.brand)) {
         return false;
       }

       // Vendor filter (handle both string and object vendors)
       if (filters.vendor.length > 0) {
         const vendorName = typeof part.vendor === 'object' ? part.vendor.businessName : part.vendor;
         if (!filters.vendor.includes(vendorName)) {
           return false;
         }
       }

       // Location filter (only for mock data)
       if (!propParts && filters.location.length > 0 && !filters.location.includes(part.location)) {
         return false;
       }

       // Ratings filter (only for mock data)
       if (!propParts && filters.ratings.length > 0) {
         const rating = part.rating || 0;
         const ratingMatch = filters.ratings.some((filterRating) => {
           return rating >= parseFloat(filterRating);
         });
         if (!ratingMatch) return false;
       }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low-high":
          return a.price - b.price;
        case "price-high-low":
          return b.price - a.price;
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredParts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentParts = filteredParts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((v) => v !== value)
        : [...prev[filterType], value],
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearAllFilters = () => {
    setFilters({
      category: [],
      price: [],
      brand: [],
      vendor: [],
      location: [],
      ratings: [],
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [filters, sortBy, searchTerm]);

  return (
    <div className="shop-page">
      <div className="container">
                 {/* Mobile Filter Toggle */}
         <div className="mobile-filter-toggle d-lg-none">
           <button
             className="btn btn-primary"
             onClick={() => setShowMobileFilters(!showMobileFilters)}
           >
             {showMobileFilters ? "Hide Filters" : "Show Filters"}
             <i className={`bi bi-${showMobileFilters ? "x" : "filter"}`} />
           </button>
         </div>

        <div className="row">
                     {/* Sidebar Filters */}
           <div
             className={`col-lg-3 ${
               showMobileFilters ? "mobile-filters-open" : "d-none d-lg-block"
             }`}
           >
            <div className="shop-sidebar">
              {/* Clear Filters */}
              <div className="shop-widget">
                <button
                  className="btn btn-outline btn-sm w-100"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </button>
              </div>

              {/* Search */}
              <div className="shop-widget">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search parts..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="shop-widget">
                <div className="check-box-item">
                  <h5 className="shop-widget-title">Category</h5>
                  <div className="checkbox-container">
                    {Array.from(new Set(availableParts.map(part => part.category || part.vehicle || 'General'))).map((category) => (
                      <label key={category} className="containerss">
                        {category}
                        <input
                          type="checkbox"
                          checked={filters.category.includes(category)}
                          onChange={() =>
                            handleFilterChange("category", category)
                          }
                        />
                        <span className="checkmark" />
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="shop-widget">
                <div className="check-box-item">
                  <h5 className="shop-widget-title">Price Range</h5>
                  <div className="checkbox-container">
                    {[
                      { value: "under-5000", label: "Under Rs. 5000" },
                      { value: "5000-50000", label: "Rs. 5000 - Rs. 50000" },
                      { value: "50000-100000", label: "Rs. 50000 - Rs. 100000" },
                      { value: "100000+", label: "Rs. 100000+" },
                    ].map((item) => (
                      <label key={item.value} className="containerss">
                        {item.label}
                        <input
                          type="checkbox"
                          checked={filters.price.includes(item.value)}
                          onChange={() =>
                            handleFilterChange("price", item.value)
                          }
                        />
                        <span className="checkmark" />
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="shop-widget">
                <div className="check-box-item">
                  <h5 className="shop-widget-title">Custom Price Range</h5>
                  <div className="price-range-container">
                    <div className="price-inputs">
                      <input
                        type="number"
                        placeholder="Min"
                        className="form-control"
                        value={filters.minPrice || ''}
                        onChange={(e) => setFilters(prev => ({...prev, minPrice: e.target.value}))}
                      />
                      <span>-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="form-control"
                        value={filters.maxPrice || ''}
                        onChange={(e) => setFilters(prev => ({...prev, maxPrice: e.target.value}))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand */}
              <div className="shop-widget">
                <div className="check-box-item">
                  <h5 className="shop-widget-title">Brand</h5>
                  <div className="checkbox-container">
                                         {Array.from(new Set(availableParts.map(part => part.brand))).map((brand) => (
                      <label key={brand} className="containerss">
                        {brand}
                        <input
                          type="checkbox"
                          checked={filters.brand.includes(brand)}
                          onChange={() => handleFilterChange("brand", brand)}
                        />
                        <span className="checkmark" />
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vendor */}
              <div className="shop-widget">
                <div className="check-box-item">
                  <h5 className="shop-widget-title">Vendor</h5>
                  <div className="checkbox-container">
                                         {Array.from(new Set(availableParts.map(part => {
                       const vendorName = typeof part.vendor === 'object' ? part.vendor.businessName : part.vendor;
                       return vendorName;
                     }))).map((vendor) => (
                      <label key={vendor} className="containerss">
                        {vendor}
                        <input
                          type="checkbox"
                          checked={filters.vendor.includes(vendor)}
                          onChange={() => handleFilterChange("vendor", vendor)}
                        />
                        <span className="checkmark" />
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="shop-widget">
                <div className="check-box-item">
                  <h5 className="shop-widget-title">Location</h5>
                  <div className="checkbox-container">
                                         {Array.from(new Set(availableParts.map(part => part.location))).map((location) => (
                      <label key={location} className="containerss">
                        {location}
                        <input
                          type="checkbox"
                          checked={filters.location.includes(location)}
                          onChange={() =>
                            handleFilterChange("location", location)
                          }
                        />
                        <span className="checkmark" />
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ratings */}
              <div className="shop-widget">
                <div className="check-box-item">
                  <h5 className="shop-widget-title">Ratings</h5>
                  <div className="checkbox-container">
                    {[
                      { value: "4.5", label: "★★★★☆ & up" },
                      { value: "4.0", label: "★★★★☆ & up" },
                      { value: "3.5", label: "★★★☆☆ & up" },
                    ].map((item) => (
                      <label key={item.value} className="containerss">
                        {item.label}
                        <input
                          type="checkbox"
                          checked={filters.ratings.includes(item.value)}
                          onChange={() =>
                            handleFilterChange("ratings", item.value)
                          }
                        />
                        <span className="checkmark" />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side (Products grid) */}
          <div className="col-lg-9">
            {/* Header for parts display */}
            {propParts ? (
              <div className="row mb-50">
                <div className="col-lg-12">
                  <div className="multiselect-bar">
                    <h6>Parts ({filteredParts.length} found)</h6>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row mb-50">
                <div className="col-lg-12">
                  <div className="multiselect-bar">
                    <h6>Shop ({filteredParts.length} products found)</h6>
                    <div className="multiselect-area">
                      <div className="single-select">
                        <span>Show</span>
                        <select
                          className="defult-select-drowpown"
                          value={itemsPerPage}
                          onChange={(e) =>
                            setItemsPerPage(Number(e.target.value))
                          }
                        >
                          <option value={6}>6</option>
                          <option value={12}>12</option>
                          <option value={24}>24</option>
                        </select>
                      </div>
                      <div className="single-select two">
                        <select
                          className="defult-select-drowpown"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                        >
                          <option value="default">Default</option>
                          <option value="price-low-high">
                            Price: Low to High
                          </option>
                          <option value="price-high-low">
                            Price: High to Low
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State - Only show for mock data */}
            {!propParts && loading && (
              <div className="text-center py-5">
                <div className="spinner"></div>
                <p className="mt-3">Loading parts...</p>
              </div>
            )}

            {/* Products Grid */}
            {(!propParts && loading) ? null : (
              <>
                {currentParts.length === 0 ? (
                  <div className="text-center py-5">
                    <h4>No parts found</h4>
                    {propParts ? (
                      <p>No parts available for this category</p>
                    ) : (
                      <p>Try adjusting your filters or search term</p>
                    )}
                    {!propParts && (
                      <button
                        className="btn btn-primary"
                        onClick={clearAllFilters}
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                                         <div className="row g-4 justify-content-center">
                       {currentParts.map((part, index) => {
                         console.log(`Rendering part ${index}:`, part); // Debug log
                         return (
                           <div key={part._id || part.id} className="col-md-6 col-lg-4">
                             <ShopCard part={part} />
                           </div>
                         );
                       })}
                     </div>

                    {/* Pagination - Only show for mock data */}
                    {!propParts && totalPages > 1 && (
                      <div className="row pt-70">
                        <div className="col-lg-12 d-flex justify-content-center">
                          <div className="paginations-area">
                            <nav>
                              <ul className="pagination">
                                <li className="page-item">
                                  <button
                                    className="page-link"
                                    onClick={() =>
                                      setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                      )
                                    }
                                    disabled={currentPage === 1}
                                  >
                                    <i className="bi bi-arrow-left-short" />
                                  </button>
                                </li>
                                {[...Array(totalPages)].map((_, index) => (
                                  <li
                                    key={index}
                                    className={`page-item ${
                                      currentPage === index + 1 ? "active" : ""
                                    }`}
                                  >
                                    <button
                                      className="page-link"
                                      onClick={() => setCurrentPage(index + 1)}
                                    >
                                      {index + 1}
                                    </button>
                                  </li>
                                ))}
                                <li className="page-item">
                                  <button
                                    className="page-link"
                                    onClick={() =>
                                      setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages)
                                      )
                                    }
                                    disabled={currentPage === totalPages}
                                  >
                                    <i className="bi bi-arrow-right-short" />
                                  </button>
                                </li>
                              </ul>
                            </nav>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopParts;
