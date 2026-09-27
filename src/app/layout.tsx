import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GEOTOON",
  description: "Media Pembelajaran Geografi Interaktif",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}