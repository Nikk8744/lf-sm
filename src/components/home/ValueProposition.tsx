import { Leaf, ShoppingBag, Truck } from "lucide-react";

const ValueProposition = () => {
  return (
    <section className="py-16 bg-[#EEEEEE]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Farm Mart?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fresh & Organic</h3>
            <p className="text-gray-600">All our products come directly from local farms, ensuring freshness and quality.</p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">We deliver your orders quickly to ensure you get the freshest produce possible.</p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Support Local Farmers</h3>
            <p className="text-gray-600">Every purchase directly supports local farmers and sustainable agriculture.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;