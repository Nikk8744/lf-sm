"use client";
import { ProductCard } from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import SidebarFilter from "@/components/SidebarFilter";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
// import SidebarFilter1 from "@/components/SidebarFilter1";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

// export const revalidate = 120;

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  farmLocation: string;
  quantity: number;
}

const ProductsPage = () => {
  return (
    <Suspense>
      <ProductsPageContent />
    </Suspense>
  );
};

const ProductsPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // const search = searchParams.get("query") || "";
  // const category = searchParams.get("category") || "";
  // const minPrice = searchParams.get("minPrice") || "";
  // const maxPrice = searchParams.get("maxPrice") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const page = searchParams.get("page") || "1";
        const currentSearchParams = new URLSearchParams(
          searchParams.toString()
        );
        currentSearchParams.set("page", page);

        const response = await fetch(
          `http://localhost:3000/api/products?${currentSearchParams.toString()}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (data.error) {
          setError(data.error);
          setProducts([]);
        } else {
          setProducts(data.products);
          setCurrentPage(data.currentPage);
          console.log("The current page isssss::", data.currentPage);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        setError(`Failed to fetch products: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", newPage.toString());
    const search = current.toString();
    // console.log("The current page in handle change isssss::",search);
    const query = search ? `?${search}` : "";
    console.log("The query isssss::", query);
    router.push(`/products${query}`);
  };

  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    // Always show first page
    items.push(
      <PaginationItem key="1">
        <PaginationLink
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Calculate the start page based on the current page and maxVisiblePages
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (endPage - startPage < maxVisiblePages - 2) {
      startPage = Math.max(2, endPage - maxVisiblePages + 2);
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      items.push(
        <PaginationItem key="start-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="end-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (loading) {
    return (
      <SidebarProvider>
        <SidebarInset>
          <div className="flex min-h-screen bg-[#EEEEEE]">
            <SidebarFilter />
            <div className="flex-1 p-4 pt-6 flex flex-col min-h-screen">
              <Skeleton className="h-10 w-48 mb-8 ml-10" /> {/* For heading */}
              <Skeleton className="h-12 w-full mb-8" /> {/* For search bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 8].map((i) => (
                  <div key={i} className="bg-white rounded-lg p-4 space-y-3">
                    <Skeleton className="h-48 w-full rounded-md" />{" "}
                    {/* Product image */}
                    <Skeleton className="h-6 w-3/4" /> {/* Product name */}
                    <Skeleton className="h-4 w-1/4" /> {/* Price */}
                    <Skeleton className="h-8 w-full" /> {/* Button */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }
  // console.log("The response issss",products)

  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="flex min-h-screen bg-[#EEEEEE]">
          {/* <SidebarFilter1 /> */}
          <SidebarFilter />
          <div className="flex-1 p-4 pt-6 flex flex-col min-h-screen">
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
              <div className="flex flex-col flex-grow">
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

                {/* Shadcn Pagination */}
                <div className="mt-auto pt-8 pb-4">
                  {" "}
                  {/* Added mt-auto to push to bottom */}
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {getPaginationItems()}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ProductsPage;
