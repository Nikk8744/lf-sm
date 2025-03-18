import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "./ui/sidebar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const SidebarFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<string | null>(
    searchParams.get("category") || "all"
  );
  const [minPrice, setMinPrice] = useState<string | null>(
    searchParams.get("minPrice") || ""
  );
  const [maxPrice, setMaxPrice] = useState<string | null>(
    searchParams.get("maxPrice") || ""
  );
  const [farmLocation, setFarmLocation] = useState<string | null>(
    searchParams.get("farmLocation") || "all"
  );

  const handleFilterChange = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (category && category !== "all") {
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

    if (farmLocation && farmLocation !== "all") {
      params.set("farmLocation", farmLocation);
    } else {
      params.delete("farmLocation");
    }

    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setFarmLocation("all");
    router.push("/products");
  };
  const hasActiveFilters = () => {
    return (
      category !== "all" ||
      farmLocation !== "all" ||
      minPrice !== "" ||
      maxPrice !== ""
    );
  };

  const FilterContent = () => (
    <div className="flex h-screen flex-col">
        <SidebarHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Filters</h2>
            {hasActiveFilters() && (
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" /> Clear all
              </Button>
            )}
          </div>
        </SidebarHeader>
        <Separator />
        <SidebarContent>
          <ScrollArea className="h-[calc(100vh-5rem)]">
            <div className="flex flex-col gap-6 p-6">
              <SidebarGroup>
                <SidebarGroupLabel className="text-lg font-medium text-gray-700">
                  Category
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="rounded-lg border-gray-300 shadow-sm">
                    <Select
                      value={category || "all"}
                      onValueChange={setCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Fruit">Fruits</SelectItem>
                        <SelectItem value="Vegetable">Vegetables</SelectItem>
                        <SelectItem value="Dairy">Dairy</SelectItem>
                        <SelectItem value="Meat">Meat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel className="text-lg font-medium text-gray-700">
                  Farm Location
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="rounded-lg border-gray-300 shadow-sm">
                    <Select
                      value={farmLocation || "all"}
                      onValueChange={setFarmLocation}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="vesu">Vesu</SelectItem>
                        <SelectItem value="bhatar">Bhatar</SelectItem>
                        <SelectItem value="Bangalore">Bangalore</SelectItem>
                        <SelectItem value="Chennai">Chennai</SelectItem>
                        <SelectItem value="parvat patiya">
                          Parvat Patiya
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel className="text-lg font-medium text-gray-700">
                  Price Range
                </SidebarGroupLabel>
                <SidebarGroupContent className="space-y-4">
                  <Input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice || ""}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full rounded-lg border-gray-300 p-3"
                  />
                  <Input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice || ""}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full rounded-lg border-gray-300 p-3"
                  />
                </SidebarGroupContent>
              </SidebarGroup>

              <Button
                onClick={handleFilterChange}
                className="w-full py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
              >
                Apply Filters
              </Button>
            </div>
          </ScrollArea>
        </SidebarContent>
      </div>
  );

   // Desktop sidebar
   const DesktopSidebar = () => (
    <Sidebar
      variant="sidebar"
      collapsible="none"
      className="hidden lg:block sticky top-0 h-screen w-64 bg-[#F7F7F7] border-r border-gray-200 shadow-lg"
    >
      <FilterContent />
    </Sidebar>
  );

  // Mobile sidebar
  const MobileSidebar = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden fixed left-3 top-24 z-40"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
        <FilterContent />
      </SheetContent>
    </Sheet>
  );


  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default SidebarFilter;
