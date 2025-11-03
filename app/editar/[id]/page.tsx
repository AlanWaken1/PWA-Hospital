"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductForm from "@/components/ProductForm";
import { Producto } from "@/types/inventario";
import { getProductoById, updateProducto } from "@/lib/storage";

export default function EditarPage() {
  const params = useParams();
  const router = useRouter();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    const prod = getProductoById(id);
    
    if (!prod) {
      router.push("/inventario");
      return;
    }

    setProducto(prod);
    setLoading(false);
  }, [params.id, router]);

  const handleSubmit = (productoActualizado: Producto) => {
    updateProducto(productoActualizado.id, productoActualizado);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">Cargando...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!producto) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductForm producto={producto} onSubmit={handleSubmit} />
      </main>
    </div>
  );
}

