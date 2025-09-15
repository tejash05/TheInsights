"use client";

import { useSession, signOut } from "next-auth/react";
import { Menu, LogOut, User } from "lucide-react";
import { useState } from "react";

export default function Header({ title }: { title: string }) {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Derive short display name
  const email = session?.user?.email || "user@example.com";
  const shortName = email.split("@")[0]; // take part before "@"
  const initial = shortName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40">
      {/* Accent line */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <div className="flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-md border-b shadow-sm">
        {/* Page Title */}
        <h1 className="text-xl font-semibold text-gray-800 truncate">{title}</h1>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                <span className="text-sm font-bold">{initial}</span>
              </div>
              {/* Show short name instead of full email */}
              <span className="text-gray-700 text-sm hidden sm:block truncate max-w-[100px]">
                {shortName}
              </span>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg border bg-white py-2 z-50">
                <div className="px-4 py-2 text-sm text-gray-600 flex items-center gap-2">
                  <User size={16} /> {email}
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="sm:hidden p-2 rounded hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
