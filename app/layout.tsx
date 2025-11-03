import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Control de Inventario Hospitalario",
  description: "Sistema de gestión de inventario para hospitales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

