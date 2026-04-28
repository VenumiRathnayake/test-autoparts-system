import React, { createContext, useContext, useState } from "react";

// Create a Cart Context
const CartContext = createContext();

// Cart Provider to wrap your app
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    // Ensure each item has a unique ID
    const itemWithId = {
      ...item,
      id: item._id || Date.now().toString(), // Use _id from database or generate a unique ID
    };
    setCartItems((prevItems) => [...prevItems, itemWithId]);
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use Cart Context
export const useCart = () => useContext(CartContext);
