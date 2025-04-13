import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yo Vendo - Encuentra el auto ideal sin buscar",
  description:
    "Publica qué auto estás buscando y recibe notificaciones cuando uno aparezca. Vende gratis. Compra sin perder tiempo.",
  keywords: [
    "compra autos",
    "venta de carros",
    "buscar auto",
    "yo vendo app",
    "autos usados México",
  ],
  authors: [{ name: "Yo Vendo" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
