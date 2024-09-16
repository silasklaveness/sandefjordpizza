"use client";
import { createContext, useState, useEffect } from "react";

export const RestaurantContext = createContext();

export default function RestaurantProvider({ children }) {
  const [selectedRestaurant, setSelectedRestaurant] = useState("Tolvsrød");

  useEffect(() => {
    const savedRestaurant = localStorage.getItem("selectedRestaurant");
    if (savedRestaurant) {
      setSelectedRestaurant(savedRestaurant);
    }
  }, []);

  useEffect(() => {
    if (selectedRestaurant) {
      localStorage.setItem("selectedRestaurant", selectedRestaurant);
    }
  }, [selectedRestaurant]);

  return (
    <RestaurantContext.Provider
      value={{ selectedRestaurant, setSelectedRestaurant }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}
