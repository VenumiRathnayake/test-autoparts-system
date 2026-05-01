import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/header/Header";
import AdminNavbar from "./components/header/AdminNavbar";
import VendorNavbar from "./components/header/VendorNavbar";
import Footer from "./components/footer/Footer";
import { authHelper } from "./services/api";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Parts from "./pages/Parts";
import ShopParts from "./pages/PartsDetails";
import Educational from "./pages/Educational";
import ReadArticle from "./components/article/ReadArticle";
import ContactUs from "./pages/ContactUs";
import Cart from "./pages/Cart";
import CheckOut from "./pages/CheckOut";
import PurchaseHistory from "./pages/PurchaseHistory";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import VendorRegister from "./pages/VendorRegister";

import AdminAddParts from "./pages/admin/AddParts";
import AdminAddArticles from "./pages/admin/AddArticles";
import AdminManageParts from "./pages/admin/ManageParts";
import AdminManageArticles from "./pages/admin/ManageArticles";
import AddCategory from "./pages/admin/AddCategory";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageVendors from "./pages/admin/ManageVendors";
import ManageCategoryRequests from "./pages/admin/ManageCategoryRequests";

import VendorAddParts from "./pages/vendor/AddParts";
import VendorManageParts from "./pages/vendor/ManageParts";
import VendorOrders from "./pages/vendor/VendorOrders";
import RequestCategory from "./pages/vendor/RequestCategory";

function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkUserRole = () => {
      if (authHelper.isLoggedIn()) {
        const role = authHelper.getRole();
        setUserRole(role);
      } else {
        setUserRole(null);
      }
    };

    // Check initially
    checkUserRole();

    // Listen for storage changes (when login/logout happens)
    const handleStorageChange = () => {
      checkUserRole();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check when the component mounts
    const interval = setInterval(checkUserRole, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Determine which navigation to show
  const NavigationComponent = () => {
    if (userRole === 'admin') {
      return <AdminNavbar />;
    } else if (userRole === 'vendor') {
      return <VendorNavbar />;
    } else {
      return <Header />;
    }
  };

  const appClassName = `App${
    userRole === "admin"
      ? " admin-app"
      : userRole === "vendor"
        ? " vendor-app"
        : ""
  }`;
  const mainClassName =
    userRole === "admin"
      ? "admin-main"
      : userRole === "vendor"
        ? "vendor-main"
        : "";

  return (
    <CartProvider>
      <Router>
        <div className={appClassName}>
          {NavigationComponent()}
          <main className={mainClassName}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/parts" element={<Parts />} />
              <Route path="/shop-parts/:carId" element={<ShopParts />} />
              <Route path="/education" element={<Educational />} />
              <Route path="/education/:id" element={<ReadArticle />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/account" element={<LogIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/vendor-register" element={<VendorRegister />} />
              <Route path="/checkout" element={<CheckOut />} />
              <Route path="/history" element={<PurchaseHistory />} />

              <Route path="/admin/add-parts" element={<AdminAddParts />} />
              <Route path="/admin/manage-parts" element={<AdminManageParts />} />
              <Route path="/admin/add-articles" element={<AdminAddArticles />} />
              <Route path="/admin/manage-articles" element={<AdminManageArticles />} />
              <Route path="/admin/add-categories" element={<AddCategory />} />
              <Route path="/admin/manage-categories" element={<ManageCategories />} />
              <Route path="/admin/manage-vendors" element={<ManageVendors />} />
              <Route path="/admin/manage-category-requests" element={<ManageCategoryRequests />} />

              <Route path="/vendor/add-parts" element={<VendorAddParts />} />
              <Route path="/vendor/manage-parts" element={<VendorManageParts />} />
              <Route path="/vendor/orders" element={<VendorOrders />} />
              <Route path="/vendor/request-category" element={<RequestCategory />} />
            </Routes>
          </main>
          {userRole !== "admin" && userRole !== "vendor" && <Footer />}
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
