"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  User,
  Menu,
  ArrowLeft,
  LayoutGrid,
  Coffee,
  Users,
  ShoppingBag,
  BarChart3,
  X,
} from "lucide-react";

const tabVariants = {
  default: { opacity: 0.7, scale: 1 },
  active: { opacity: 1, scale: 1.05 },
  hover: { scale: 1.1 },
};

const mobileMenuVariants = {
  closed: { x: "-100%", opacity: 0 },
  open: { x: 0, opacity: 1 },
};

const iconMap = {
  Profile: User,
  Categories: LayoutGrid,
  "Menu Items": Coffee,
  Users: Users,
  Orders: ShoppingBag,
  Oversikt: BarChart3,
  Restaurant: LayoutGrid,
};

const tabs = [
  { name: "Profile", href: "/dashboard/profile", adminOnly: false },
  { name: "Categories", href: "/dashboard/categories", adminOnly: true },
  { name: "Menu Items", href: "/dashboard/menu-items", adminOnly: true },
  { name: "Users", href: "/dashboard/users", adminOnly: true },
  { name: "Orders", href: "/dashboard/orders", adminOnly: false },
  { name: "Oversikt", href: "/dashboard/oversikt", adminOnly: true },
  { name: "Restaurant", href: "/dashboard/restaurant", adminOnly: true },
];

export default function AdminNavbar({ isAdmin = false }) {
  const path = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && !user) {
      fetch("/api/profile")
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
        })
        .catch((error) => console.error("Error fetching profile data:", error));
    }
  }, [status, user]);

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);

  const handleNavigation = useCallback(
    (href) => {
      router.push(href);
      setIsMenuOpen(false);
    },
    [router]
  );

  // If the user is not authenticated, don't render anything
  if (status !== "authenticated") {
    return null;
  }

  const TabContent = () => (
    <>
      <div className="p-4 border-b border-yellow-400">
        <div className="flex items-center justify-between mb-2 mt-2 mr-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-yellow-400 hover:text-yellow-300"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center overflow-hidden">
              {user?.image ? (
                <Image
                  className="object-cover w-full h-full"
                  src={user.image}
                  alt="avatar"
                  width={250}
                  height={250}
                />
              ) : (
                <User className="text-black" />
              )}
            </div>
            <div className="text-yellow-100">
              <p className="font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-yellow-400">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        {tabs.map((tab) => {
          if (tab.adminOnly && !isAdmin) return null;

          const isActive = tab.href === path || path.includes(tab.href);
          const Icon = iconMap[tab.name];

          return (
            <Button
              key={tab.name}
              variant="ghost"
              className={cn(
                "w-full flex items-center justify-start space-x-3 py-2 px-3 rounded-md transition-all duration-200 ease-in-out mb-2",
                isActive
                  ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/50"
                  : "text-yellow-100 hover:bg-yellow-900"
              )}
              onClick={() => handleNavigation(tab.href)}
            >
              <motion.div
                variants={tabVariants}
                initial="default"
                animate={isActive ? "active" : "default"}
                whileHover="hover"
                className="flex items-center space-x-3"
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{tab.name}</span>
              </motion.div>
            </Button>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile menu toggle button */}
      <Button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 md:hidden bg-yellow-400 text-black hover:bg-yellow-300"
        size="icon"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Desktop sidebar - always visible */}
      <div className="hidden md:block w-64 h-screen fixed left-0 top-0 bg-black flex-col overflow-hidden">
        <TabContent />
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-y-0 left-0 z-50 w-64 md:hidden bg-black"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="w-full h-full flex flex-col">
              <div className="flex justify-end p-2">
                <Button
                  onClick={toggleMenu}
                  size="icon"
                  variant="ghost"
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <TabContent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
