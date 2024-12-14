"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { FaBars, FaBook, FaUsers } from "react-icons/fa";
import { FaGaugeSimple, FaXmark } from "react-icons/fa6";

const AdminPageLayout = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin-dashboard/admin-dash",
      icon: <FaGaugeSimple className="mr-2" />,
    },
    {
      name: "Tenants",
      path: "/admin-dashboard/tennants",
      icon: <FaUsers className="mr-2" />,
    },
    {
      name: "Occupancy",
      path: "/admin-dashboard/occupancy",
      icon: <FaBook className="mr-2" />,
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        z-10
        className={clsx(
          "bg-gray-800 text-white transition-all duration-300 z-20",
          isCollapsed ? "w-0 overflow-hidden" : "w-64"
        )}
      >
        <div className="flex justify-end">
          <button
            className="p-4 focus:outline-none"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <FaBars /> : <FaXmark />}
          </button>
        </div>

        {/* Render the menu only if sidebar is expanded */}
        {!isCollapsed && (
          <ul className="space-y-4 mt-4 ml-3">
            {menuItems.map((item) => (
              <li key={item.path} className="text-start">
                <Link href={item.path}>
                  <div
                    onClick={() => setIsCollapsed(true)}
                    className={clsx(
                      "flex items-center block p-2 hover:bg-gray-700 rounded-md transition-colors",
                      pathname === item.path && "bg-gray-700"
                    )}
                  >
                    {item.icon}
                    {item.name}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Menu bar button when sidebar is collapsed */}
      {isCollapsed && (
        <button
          className="absolute top-1 left-3 bg-gray-800 text-white p-4 rounded-md"
          onClick={() => setIsCollapsed(false)}
        >
          <FaBars />
        </button>
      )}

      {/* Content Area */}
      <div className="absolute">{children}</div>
    </div>
  );
};

export default AdminPageLayout;
