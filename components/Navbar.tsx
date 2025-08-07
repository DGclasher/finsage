"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useState } from "react";
import {
  Home,
  TrendingUp,
  TrendingDown,
  PieChart,
  LogOut,
  User,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Income", href: "/dashboard/income", icon: TrendingUp },
  { name: "Expenses", href: "/dashboard/expenses", icon: TrendingDown },
  { name: "Investments", href: "/dashboard/investments", icon: PieChart },
];

export default function Navbar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg sm:text-xl font-bold"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="text-gray-900">FinSage</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop User Menu */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-200 text-xs sm:text-sm"
          >
            <User className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Profile</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-xs sm:text-sm"
          >
            <LogOut className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="outline"
          size="sm"
          className="lg:hidden border-gray-200"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-4 h-4" />
          ) : (
            <Menu className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 pb-4 border-t border-gray-200/50">
          <div className="space-y-2 mt-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 w-full",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile User Actions */}
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-200/50">
            <Button variant="outline" className="border-gray-200 justify-start">
              <User className="w-4 h-4 mr-3" />
              Profile
            </Button>
            <Button
              variant="outline"
              onClick={logout}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 justify-start"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
