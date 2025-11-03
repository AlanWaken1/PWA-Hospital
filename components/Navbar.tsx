"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span className="text-xl font-bold">Inventario Hospitalario</span>
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/inventario"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/inventario")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                Inventario
              </Link>
              <Link
                href="/agregar"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/agregar")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                Agregar Producto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

