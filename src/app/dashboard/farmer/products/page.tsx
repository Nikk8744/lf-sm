import ProductsTable from '@/components/dashboard/ProductsTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const ProductsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/dashboard/farmer/products/add">
          <Button>Add New Product</Button>
        </Link>
      </div>
      <ProductsTable />
    </div>
  )
}

export default ProductsPage