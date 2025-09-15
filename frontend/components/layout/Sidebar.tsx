"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Settings,
  LogOut,
  Activity, // 👈 for Events
} from "lucide-react";
import { signOut } from "next-auth/react"; // ✅ import signOut

const navItems = [
  { name: "Overview", href: "/overview", icon: LayoutDashboard },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Products", href: "/products", icon: Package },
  { name: "Events", href: "/events", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-gray-900 text-white h-screen flex flex-col transition-all duration-300 
      ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Logo + Collapse button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <span className={`${collapsed ? "hidden" : "block"} font-bold text-lg`}>
          Shopify Dashboard
        </span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white"
        >
          {collapsed ? "➡" : "⬅"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-md 
                transition-colors duration-200 
                ${isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-800"}`}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout at bottom */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })} // ✅ log out properly
          className="flex items-center gap-3 text-gray-300 hover:text-white w-full"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
