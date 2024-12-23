import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";

const inter = Inter({ subsets: ["latin"], preload: false });

export const metadata: Metadata = {
  title: "Sunny PG",
  description: "Hostel and PG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div>
          <Navbar />
        </div>
        <div className="h-full">{children}</div>
      </body>
    </html>
  );
}
