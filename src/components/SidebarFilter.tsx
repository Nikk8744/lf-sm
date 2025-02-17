// src/components/SidebarFilter.tsx

"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SidebarFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<string | null>(null);

  const handleFilterChange = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    
    if (minPrice) {
      params.set("minPrice", minPrice);
    } else {
      params.delete("minPrice");
    }
    
    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    } else {
      params.delete("maxPrice");
    }

    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    router.push("/products");
  };

  return (
    <div className="w-64 p-4 border-r">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Filters</h2>
        {(category || minPrice || maxPrice) && (
          <button 
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear all
          </button>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <select
          value={category || ""}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">All Categories</option>
          <option value="Fruit">Fruits</option>
          <option value="Vegetable">Vegetables</option>
          <option value="Dairy">Dairy</option>
          <option value="Meat">Meat</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice || ""}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice || ""}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <button
        onClick={handleFilterChange}
        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default SidebarFilter;
