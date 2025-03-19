"use client";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("query") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (search) {
      params.set("query", search);
    } else {
      params.delete("query");
    }

    router.push(`/products?${params.toString()}`);
  };
  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mb-8 px-4 sm:px-6 lg:px-8">
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Button
          type="submit"
          variant="default"
          className="absolute right-2 px-4 h-8 py-1 text-white rounded-xl hover:bg-blue-700"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
