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
        <div className="mx-5">{children}</div>
        <hr className="my-5" />
        <footer className="footer footer-center bg-base-300 text-base-content p-4 text-center my-5">
          <aside>
            <p>
              Copyright © {new Date().getFullYear()} - All right reserved by Sunny
              Boys Hostel & PG
            </p>
          </aside>
        </footer>
      </body>
    </html>
  );
}
