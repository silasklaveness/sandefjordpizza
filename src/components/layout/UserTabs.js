"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Search, X, Menu, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const tabVariants = {
  default: { opacity: 0.7 },
  active: { opacity: 1 },
};

const menuVariants = {
  closed: { x: "-100%", opacity: 0 },
  open: { x: 0, opacity: 1 },
};

export default function UserTabs({ isAdmin }) {
  const path = usePathname();
  const session = useSession();
  const { status } = session;
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

  const tabs = [
    { name: "Profile", href: "/profile", icon: User, adminOnly: false },
    { name: "Categories", href: "/categories", icon: User, adminOnly: true },
    { name: "Menu Items", href: "/menu-items", icon: User, adminOnly: true },
    { name: "Users", href: "/users", icon: User, adminOnly: true },
    { name: "Orders", href: "/orders", icon: User, adminOnly: false },
    { name: "Oversikt", href: "/oversikt", icon: User, adminOnly: true },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const TabContent = () => (
    <>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center overflow-hidden">
              {user?.image ? (
                <Image
                  className="object-cover w-full h-full"
                  src={user.image}
                  alt="avatar"
                  width={250}
                  height={250}
                />
              ) : (
                <User className="text-primary-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium">{user?.name || "User"}</p>
              <p className="text-sm text-muted-foreground">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>
        <div className="relative">
          <Search
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input className="pl-8" placeholder="Search" />
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        {tabs.map((tab) => {
          if (tab.adminOnly && !isAdmin) return null;

          const isActive = tab.href === path || path.includes(tab.href);

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex items-center space-x-3 py-2 px-3 rounded-md transition-all duration-200 ease-in-out mb-1",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <motion.div
                variants={tabVariants}
                initial="default"
                animate={isActive ? "active" : "default"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3"
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{tab.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      <Button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 md:hidden"
        size="icon"
        variant="outline"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Desktop version */}
      <Card className="w-64 h-screen fixed left-0 top-0 shadow-md flex flex-col hidden md:flex">
        <TabContent />
      </Card>

      {/* Mobile version */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
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
            className="fixed inset-y-0 left-0 z-50 w-64 md:hidden"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="w-full h-full shadow-md flex flex-col">
              <div className="flex justify-end p-2">
                <Button onClick={toggleMenu} size="icon" variant="ghost">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <TabContent />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
