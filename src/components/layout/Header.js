"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../AppContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Facebook,
  Instagram,
  Youtube,
  User,
  Menu,
  X,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState("up");

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (
        direction !== scrollDirection &&
        (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)
      ) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDirection);
    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, [scrollDirection]);

  return scrollDirection;
}

export default function LuxuriousHeader() {
  const { data: session, status } = useSession();
  const userData = session?.user;
  let userName = userData?.name || userData?.email;
  const { cartProducts } = useContext(CartContext);

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const scrollDirection = useScrollDirection();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (userName && userName.includes(" ")) {
    userName = userName.split(" ")[0];
  }

  const navItems = [
    { href: "/", label: "Hjem" },
    { href: "/menu", label: "Meny" },
    { href: "/#about", label: "Om oss" },
    { href: "/#contact", label: "Kontakt" },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

  const isHomePage = pathname === "/";
  const isTransparent = isHomePage && !isScrolled;
  const isMenuPage = pathname === "/menu";

  const hiddenPages = [
    "/dashboard/profile",
    "/dashboard/categories",
    "/dashboard/menu-items",
    "/dashboard/users",
    "/dashboard/orders",
    "/dashboard/oversikt",
    "/dashboard/restaurant",
  ];
  const shouldHideHeader = hiddenPages.some((page) =>
    pathname.startsWith(page)
  );

  if (shouldHideHeader) {
    return null;
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent && !isOpen ? "bg-transparent" : "bg-black shadow-lg"
      } ${
        isMenuPage && scrollDirection === "down"
          ? "-translate-y-full"
          : "translate-y-0"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between relative">
        {/* Logo */}
        <Link href="/" className="z-10 relative">
          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="text-yellow-400">SANDEFJORD</span>{" "}
            <span className="text-white">PIZZA</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors font-medium text-sm uppercase ${
                pathname === item.href
                  ? "text-yellow-400"
                  : "text-gray-300 hover:text-yellow-400"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <Link
            href="/cart"
            className="z-10 relative text-gray-300 hover:text-yellow-400 transition-colors"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartProducts.length > 0 && (
              <motion.span
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-yellow-400 text-black rounded-full text-xs font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                {cartProducts.length}
              </motion.span>
            )}
          </Link>

          {/* User Authentication */}
          <div className="hidden md:flex items-center gap-2">
            {status === "authenticated" ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/profile"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <User size={24} />
                </Link>
                <Button
                  onClick={() => signOut()}
                  className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-all duration-300 rounded-full px-4 py-2 text-sm font-semibold"
                >
                  Logg ut
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  Logg inn
                </Link>
                <Button
                  asChild
                  className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-all duration-300 rounded-full px-4 py-2 text-sm font-semibold"
                >
                  <Link href="/register">Registrer</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden transition-colors text-gray-300 hover:text-yellow-400 relative z-10"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="z-999 fixed inset-0 flex items-start justify-center pt-20 bg-black bg-opacity-90 backdrop-blur-sm text-white"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="relative w-full max-w-md mx-auto bg-black">
              <div className="flex flex-col space-y-6 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="text-2xl font-semibold text-white hover:text-yellow-400 transition-colors ml-8"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Authentication Links */}
              <div className="flex flex-col mt-8 space-y-4">
                {status === "authenticated" ? (
                  <>
                    <Link
                      href="/dashboard/profile"
                      onClick={closeMenu}
                      className="text-2xl font-semibold text-white hover:text-yellow-400 transition-colors ml-8"
                    >
                      {userName}
                    </Link>
                    <Button
                      onClick={() => {
                        signOut();
                        closeMenu();
                      }}
                      className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-all duration-300 rounded-full px-6 py-3 w-full text-lg font-semibold"
                    >
                      Logg ut
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="ghost"
                      onClick={closeMenu}
                      className="justify-start p-0 text-white hover:text-yellow-400 text-lg font-normal"
                    >
                      <Link href="/login">Logg inn</Link>
                    </Button>
                    <Button
                      asChild
                      className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-all duration-300 rounded-full px-6 py-3 w-full text-lg font-semibold"
                      onClick={closeMenu}
                    >
                      <Link href="/register">Registrer</Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Social Media Icons */}
              <div className="flex space-x-6 justify-center mt-10">
                <motion.a
                  href="#"
                  className="text-white hover:text-yellow-400 transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Facebook size={30} />
                </motion.a>
                <motion.a
                  href="#"
                  className="text-white hover:text-yellow-400 transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Instagram size={30} />
                </motion.a>
                <motion.a
                  href="#"
                  className="text-white hover:text-yellow-400 transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Youtube size={30} />
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
