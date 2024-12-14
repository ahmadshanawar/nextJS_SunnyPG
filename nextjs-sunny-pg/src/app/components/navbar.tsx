"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import useUserStore from "@/lib/store/userStore";
import { supabase } from "@/lib/supabase";
import {
  FaPowerOff,
  FaHome,
  FaMoneyBillWave,
  FaTachometerAlt,
} from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const { role, userId, setRole, setStatus, setUserId } = useUserStore();

  let navLinks = [
    {
      id: 1,
      name: "Home",
      href: "/",
      icon: <FaHome className="mr-1 text-gray-500" />,
    },
    {
      id: 2,
      name: "Pricing",
      href: "/pricing",
      icon: <FaMoneyBillWave className="mr-1 text-gray-500" />,
    },
  ];

  const dashboardLink = [
    {
      id: 4,
      name: "Dashboard",
      href: `${role === "user" ? "/user-dashboard" : "/admin-dashboard"}`,
      icon: <FaTachometerAlt className="mr-1 text-gray-500" />,
    },
  ];

  const logout = [
    {
      id: 5,
      name: "Logout",
      href: "/login",
      icon: <FaPowerOff className="mr-1 text-gray-500" />,
    },
  ];

  if (userId) {
    navLinks = [...navLinks, ...dashboardLink, ...logout];
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    localStorage.removeItem("supabaseSession");
    setUserId(null);
    setRole(null);
    setStatus(null);
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Website Icon and Title */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center justify-center bg-purple-800 text-white font-bold text-4xl h-10 w-10 rounded-md shadow-lg">
                S
              </div>
            </Link>
            <div className="text-[#3d3e40] text-xl md:text-xl lg:text-2xl mx-2">
              Sunny Boys' Hostel & PG
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="sm:hidden flex items-center">
            <button
              className="text-gray-800 hover:text-blue-500 focus:outline-none"
              aria-label="Toggle menu"
              onClick={toggleMenu}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div
            className={`hidden sm:flex space-x-4 ${
              isMenuOpen
                ? "flex-col absolute top-16 left-0 bg-white w-full z-10"
                : ""
            }`}
          >
            {navLinks.map((link) => (
              <Link key={link.id} href={link.href}>
                <div
                  onClick={
                    userId && link.name === "Logout" ? handleLogout : () => {}
                  }
                  className={clsx(
                    "text-gray-800 hover:text-black-500 transition duration-300 py-2 px-4 rounded-md",
                    {
                      "bg-purple-800 text-white": pathName === link.href, // Highlight the active link
                      "hover:bg-[#af91eb]": pathName !== link.href, // Slightly darker background when not active
                    }
                  )}
                >
                  <div className="flex items-center">
                    {link.icon}
                    {link.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="sm:hidden flex flex-col space-y-4 bg-white shadow-lg py-4">
            {navLinks.map((link) => (
              <Link key={link.id} href={link.href}>
                <div
                  className={clsx(
                    "text-gray-800 hover:text-black-500 transition duration-300 py-2 px-4 rounded-md",
                    {
                      "bg-purple-800 text-white": pathName === link.href, // Highlight the active link
                      "hover:bg-[#af91eb]": pathName !== link.href, // Slightly darker background when not active
                    }
                  )}
                >
                  <div className="flex items-center">
                    {link.icon}
                    {link.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
