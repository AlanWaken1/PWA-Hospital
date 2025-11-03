"use client";

import Navbar from "@/components/Navbar";
import ProductForm from "@/components/ProductForm";
import { Producto } from "@/types/inventario";
import { addProducto } from "@/lib/storage";

export default function AgregarPage() {
  const handleSubmit = (producto: Producto) => {
    addProducto(producto);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductForm onSubmit={handleSubmit} />
      </main>
    </div>
  );
}

