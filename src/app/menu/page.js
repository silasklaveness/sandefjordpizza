"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import MenyItem from "@/components/meny/MenyItem";

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Alle");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetch("/api/categories").then((res) => {
      res.json().then((categories) => {
        setCategories(categories);
        if (categories.length > 0) {
          setActiveCategory(categories[0]._id);
          setSubCategories(categories[0].subcategories || []);
        }
      });
    });
    fetch("/api/menu-items").then((res) => {
      res.json().then((menuItems) => {
        setMenuItems(menuItems);
        setFilteredItems(menuItems);
      });
    });
  }, []);

  useEffect(() => {
    let filtered = menuItems;

    if (activeCategory) {
      filtered = filtered.filter((item) => item.category === activeCategory);
    }

    if (activeFilter !== "Alle") {
      filtered = filtered.filter((item) => item.subcategory === activeFilter);
    }

    if (selectedItem) {
      filtered = [
        selectedItem,
        ...filtered.filter((item) => item._id !== selectedItem._id),
      ];
    }

    setFilteredItems(filtered);
  }, [activeCategory, activeFilter, menuItems, selectedItem]);

  useEffect(() => {
    if (searchTerm) {
      const results = menuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description &&
            item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, menuItems]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    const selectedCategory = categories.find((c) => c._id === categoryId);
    setSubCategories(selectedCategory?.subcategories || []);
    setActiveFilter("Alle");
    setSelectedItem(null);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setSelectedItem(null);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSearchResultClick = (item) => {
    setActiveCategory(item.category);
    setActiveFilter(item.subcategory);
    setSearchTerm("");
    setIsSearchFocused(false);
    setSelectedItem(item);
    const selectedCategory = categories.find((c) => c._id === item.category);
    setSubCategories(selectedCategory?.subcategories || []);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c._id === categoryId);
    return category ? category.name : "";
  };

  const getSubcategoryName = (categoryId, subcategoryId) => {
    const category = categories.find((c) => c._id === categoryId);
    if (category && category.subcategories) {
      const subcategory = category.subcategories.find(
        (sc) => sc._id === subcategoryId
      );
      return subcategory ? subcategory.name : "";
    }
    return "";
  };

  return (
    <section className="bg-white text-white min-h-screen mt-14 md:mt-16">
      <div className="bg-black shadow-md py-4 sticky top-0 z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <motion.button
                  key={category._id}
                  className={`text-lg md:text-xl font-bold whitespace-nowrap pb-2 ${
                    activeCategory === category._id
                      ? "text-yellow-400 border-b-2 border-yellow-400"
                      : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => handleCategoryChange(category._id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.name.toUpperCase()}
                </motion.button>
              ))}
            </div>
            <div className="relative w-full md:w-64" ref={searchRef}>
              <Input
                type="text"
                placeholder="Search menu..."
                className="pl-10 pr-4 py-2 w-full rounded-full border-2 border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-orange-900 text-white placeholder-gray-300"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400"
                size={20}
              />
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute z-30 mt-2 w-full bg-gray-800 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((item) => (
                    <div
                      key={item._id}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleSearchResultClick(item)}
                    >
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-sm text-gray-400">
                        {getCategoryName(item.category)} &gt;{" "}
                        {getSubcategoryName(item.category, item.subcategory)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              <motion.button
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeFilter === "Alle"
                    ? "bg-yellow-400 text-orange-900"
                    : "bg-orange-800 text-white hover:bg-orange-700"
                }`}
                onClick={() => handleFilterChange("Alle")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                All
              </motion.button>
              {subCategories.map((filter) => (
                <motion.button
                  key={filter._id}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeFilter === filter._id
                      ? "bg-yellow-400 text-orange-900"
                      : "bg-orange-800 text-white hover:bg-orange-700"
                  }`}
                  onClick={() => handleFilterChange(filter._id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {filter.name}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredItems.map((item) => (
              <MenyItem key={item._id} {...item} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <p className="text-center text-gray-300 mt-8">
            No menu items found. Try adjusting your search or category
            selection.
          </p>
        )}
      </div>
    </section>
  );
}
