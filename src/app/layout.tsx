import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "GEOTOON",
  description: "Media Pembelajaran Geografi Interaktif",
  icons: {
    icon: "/images/characters/pengenalan-geotoon.png",
    apple: "/images/characters/pengenalan-geotoon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}