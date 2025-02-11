import { ProductCard } from '@/components/ProductCard'
import React from 'react'

const ProductsPage = async () => {
  const response = await fetch(`http://localhost:3000/api/products`);
  const products = await response.json();
  console.log("The response issss",products)
  if(!response){
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl text-red-500">{products.error}</h2>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product: any) => (
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
    </div>
  )
}

export default ProductsPage