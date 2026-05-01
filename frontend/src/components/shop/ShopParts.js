import React, { useEffect, useState } from "react";
import {
  BiFilterAlt,
  BiLeftArrowAlt,
  BiRightArrowAlt,
  BiX,
} from "react-icons/bi";
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

  const availableParts = propParts || mockParts || [];

  const filteredParts = availableParts
    .filter((part) => {
      if (
        searchTerm &&
        !part.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      if (filters.category.length > 0) {
        const partCategory = part.category || part.vehicle || "General";
        if (!filters.category.includes(partCategory)) {
          return false;
        }
      }

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

        if (!priceMatch) {
          return false;
        }
      }

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

      if (filters.brand.length > 0 && !filters.brand.includes(part.brand)) {
        return false;
      }

      if (filters.vendor.length > 0) {
        const vendorName =
          typeof part.vendor === "object"
            ? part.vendor.businessName
            : part.vendor;
        if (!filters.vendor.includes(vendorName)) {
          return false;
        }
      }

      if (
        !propParts &&
        filters.location.length > 0 &&
        !filters.location.includes(part.location)
      ) {
        return false;
      }

      if (!propParts && filters.ratings.length > 0) {
        const rating = part.rating || 0;
        const ratingMatch = filters.ratings.some(
          (filterRating) => rating >= parseFloat(filterRating)
        );
        if (!ratingMatch) {
          return false;
        }
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
        ? prev[filterType].filter((entry) => entry !== value)
        : [...prev[filterType], value],
    }));
    setCurrentPage(1);
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [filters, sortBy, searchTerm]);

  return (
    <div className="shop-page">
      <div className="shop-shell">
        <div className="shop-page__header">
          <div className="shop-page__eyebrow">
            {propParts ? "Compatible Parts" : "Parts Marketplace"}
          </div>
          <h1>
            {propParts
              ? "Browse Available Parts"
              : "Find the Right Spare Part Faster"}
          </h1>
          <p>
            {propParts
              ? "Compare vendor listings, pricing, and availability for this vehicle category."
              : "Filter by category, brand, vendor, and budget to find parts that fit your needs."}
          </p>
        </div>

        <div className="mobile-filter-toggle d-lg-none">
          <button
            className="btn btn-primary"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            {showMobileFilters ? "Hide Filters" : "Show Filters"}
            {showMobileFilters ? <BiX /> : <BiFilterAlt />}
          </button>
        </div>

        <div className="shop-layout">
          <aside
            className={`shop-layout__sidebar ${
              showMobileFilters ? "mobile-filters-open" : "d-none d-lg-block"
            }`}
          >
            <div className="shop-sidebar">
              <div className="shop-widget">
                <button
                  className="btn btn-outline btn-sm w-100"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </button>
              </div>

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

              <div className="shop-widget">
                <div className="check-box-item">
                  <h5 className="shop-widget-title">Category</h5>
                  <div className="checkbox-container">
                    {Array.from(
                      new Set(
                        availableParts.map(
                          (part) => part.category || part.vehicle || "General"
                        )
                      )
                    ).map((category) => (
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

              <div className="shop-widget">
                <div className="check-box-item">
                  <h5 className="shop-widget-title">Price Range</h5>
                  <div className="checkbox-container">
                    {[
                      { value: "under-5000", label: "Under Rs. 5000" },
                      { value: "5000-50000", label: "Rs. 5000 - Rs. 50000" },
                      {
                        value: "50000-100000",
                        label: "Rs. 50000 - Rs. 100000",
                      },
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

              <div className="shop-widget">
                <div className="check-box-item">
                  <h5 className="shop-widget-title">Custom Price Range</h5>
                  <div className="price-range-container">
                    <div className="price-inputs">
                      <input
                        type="number"
                        placeholder="Min"
                        className="form-control"
                        value={filters.minPrice || ""}
                        onChange={(event) =>
                          setFilters((prev) => ({
                            ...prev,
                            minPrice: event.target.value,
                          }))
                        }
                      />
                      <span>-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="form-control"
                        value={filters.maxPrice || ""}
                        onChange={(event) =>
                          setFilters((prev) => ({
                            ...prev,
                            maxPrice: event.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="shop-widget">
                <div className="check-box-item">
                  <h5 className="shop-widget-title">Brand</h5>
                  <div className="checkbox-container">
                    {Array.from(
                      new Set(availableParts.map((part) => part.brand))
                    ).map((brand) => (
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

              <div className="shop-widget">
                <div className="check-box-item">
                  <h5 className="shop-widget-title">Vendor</h5>
                  <div className="checkbox-container">
                    {Array.from(
                      new Set(
                        availableParts.map((part) =>
                          typeof part.vendor === "object"
                            ? part.vendor.businessName
                            : part.vendor
                        )
                      )
                    ).map((vendor) => (
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

              {!propParts && (
                <div className="shop-widget">
                  <div className="check-box-item">
                    <h5 className="shop-widget-title">Location</h5>
                    <div className="checkbox-container">
                      {Array.from(
                        new Set(availableParts.map((part) => part.location))
                      ).map((location) => (
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
              )}

              {!propParts && (
                <div className="shop-widget">
                  <div className="check-box-item">
                    <h5 className="shop-widget-title">Ratings</h5>
                    <div className="checkbox-container">
                      {[
                        { value: "4.5", label: "4.5 & up" },
                        { value: "4.0", label: "4.0 & up" },
                        { value: "3.5", label: "3.5 & up" },
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
              )}
            </div>
          </aside>

          <div className="shop-layout__content">
            <div className="multiselect-bar">
              <div className="multiselect-bar__summary">
                <h6>{propParts ? "Parts" : "Shop Parts"}</h6>
                <p>
                  {filteredParts.length} item
                  {filteredParts.length === 1 ? "" : "s"} found
                </p>
              </div>

              {!propParts && (
                <div className="multiselect-area">
                  <div className="single-select">
                    <span>Show</span>
                    <select
                      className="defult-select-drowpown"
                      value={itemsPerPage}
                      onChange={(event) =>
                        setItemsPerPage(Number(event.target.value))
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
                      onChange={(event) => setSortBy(event.target.value)}
                    >
                      <option value="default">Default</option>
                      <option value="price-low-high">Price: Low to High</option>
                      <option value="price-high-low">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {!propParts && loading && (
              <div className="shop-state">
                <div className="spinner"></div>
                <p>Loading parts...</p>
              </div>
            )}

            {!propParts && loading ? null : (
              <>
                {currentParts.length === 0 ? (
                  <div className="shop-state no-products">
                    <h4>No parts found</h4>
                    {propParts ? (
                      <p>No parts available for this category.</p>
                    ) : (
                      <p>Try adjusting your filters or search term.</p>
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
                    <div className="shop-products-grid">
                      {currentParts.map((part) => (
                        <div
                          key={part._id || part.id}
                          className="shop-products-grid__item"
                        >
                          <ShopCard part={part} />
                        </div>
                      ))}
                    </div>

                    {!propParts && totalPages > 1 && (
                      <div className="paginations-area">
                        <nav>
                          <ul className="pagination">
                            <li className="page-item">
                              <button
                                className="page-link"
                                onClick={() =>
                                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                                }
                                disabled={currentPage === 1}
                              >
                                <BiLeftArrowAlt />
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
                                <BiRightArrowAlt />
                              </button>
                            </li>
                          </ul>
                        </nav>
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
