import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const SearchFilter = () => {

    const router = useRouter()
    const searchParams = useSearchParams();

    const [search , setSearch ] = useState(searchParams.get("query") || "")
    const [category , setCategory ] = useState(searchParams.get("category") || "")
    const [minPrice , setMinPrice ] = useState(searchParams.get("minPrice") || "")
    const [maxPrice , setMaxPrice ] = useState(searchParams.get("maxPrice") || "")

    const applyFilters = () => {
        const params: any = {};
        if (search) params.query = search;
        if (category) params.category = category;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
    
        // Update the URL without reloading the page
        router.push("/products");
      };
    
      useEffect(() => {
        // When the URL parameters change, update the state
        const newSearchParams = searchParams.toString();
        if (newSearchParams) {
          const newParams = new URLSearchParams(newSearchParams);
          setSearch(newParams.get("query") || "");
          setCategory(newParams.get("category") || "");
          setMinPrice(newParams.get("minPrice") || "");
          setMaxPrice(newParams.get("maxPrice") || "");
        }
      }, [searchParams]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search products..."
        className="px-4 py-2 border rounded-lg w-full sm:w-1/3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      
      {/* Category Dropdown */}
      <select
        className="px-4 py-2 border rounded-lg w-full sm:w-1/4"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="Fruits">Fruits</option>
        <option value="Vegetables">Vegetables</option>
        {/* Add more categories as needed */}
      </select>

      {/* Price Range Filters */}
      <input
        type="number"
        placeholder="Min Price"
        className="px-4 py-2 border rounded-lg w-full sm:w-1/4"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Max Price"
        className="px-4 py-2 border rounded-lg w-full sm:w-1/4"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />

      {/* Filter Button */}
      <button
        onClick={applyFilters}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Apply Filters
      </button>
    </div>
  )
}

export default SearchFilter