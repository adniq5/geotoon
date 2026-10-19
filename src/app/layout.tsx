import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "GEOTOON",
  description: "Media Pembelajaran Geografi Interaktif",
  icons: {
    icon: [
      {
        url: "/images/geotoon-icon-192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/images/geotoon-icon-512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    apple: [
      {
        url: "/images/geotoon-icon-512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
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