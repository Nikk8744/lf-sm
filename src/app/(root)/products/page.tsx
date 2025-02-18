"use client";
import { ProductCard } from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import SidebarFilter from "@/components/SidebarFilter";
// import SidebarFilter1 from "@/components/SidebarFilter1";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

// export const revalidate = 120;

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const search = searchParams.get("query") || "";
  // const category = searchParams.get("category") || "";
  // const minPrice = searchParams.get("minPrice") || "";
  // const maxPrice = searchParams.get("maxPrice") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // const params: { [key: string]: string } = {};
        // if (category) params.category = category;
        // if (minPrice) params.minPrice = minPrice;
        // if (maxPrice) params.maxPrice = maxPrice;

        // const queryString = new URLSearchParams(params).toString();

        const response = await fetch(
          `http://localhost:3000/api/products?${searchParams.toString()}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (data.error) {
          setError(data.error);
          setProducts([]);
        } else {
          setProducts(data);
        }
      } catch (error) {
        setError(`Failed to fetch products: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl">Loading...</h2>
      </div>
    );
  }

  // console.log("The response issss",products)

  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="flex min-h-screen bg-[#EEEEEE]">
          {/* <SidebarFilter1 /> */}
          <SidebarFilter />
          <div className="flex-1 p-4 pt-6">
            <h1 className="text-3xl font-bold mb-8 ml-10">All Products</h1>
            <SearchBar />
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xl text-gray-600">No products found</p>
                <p className="text-sm text-gray-500 mt-2">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    description={product.description}
                    imageUrl={product.image}
                    farmLocation={product.farmLocation}
                    quantity={product.quantity}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ProductsPage;
