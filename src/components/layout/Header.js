"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../AppContext";
import ShoppingCart from "../icons/ShoppingCart";
import { motion, AnimatePresence } from "framer-motion";
import {
  Facebook,
  Instagram,
  Youtube,
  User,
  Menu,
  X,
  ChevronDown,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LuxuriousHeader() {
  const { data: session, status } = useSession();
  const userData = session?.user;
  let userName = userData?.name || userData?.email;
  const { cartProducts } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Tolvsrød");

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
    closed: { opacity: 0, y: "-100%" },
    open: { opacity: 1, y: 0 },
  };

  const linkVariants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0 },
  };

  return (
    <motion.header
      className="sticky top-0 z-50"
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          isScrolled
            ? "bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-md"
            : "bg-gradient-to-b from-black/50 to-transparent"
        }`}
      ></div>
      <nav className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between relative">
        <Link
          href="/"
          className="flex items-center space-x-2 text-3xl font-extrabold text-white z-10 relative"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={50}
              className="filter drop-shadow-lg"
            />
          </motion.div>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <motion.div
              key={item.href}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={item.href}
                className="text-white hover:text-orange-400 transition-colors font-medium text-lg relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 transition-all group-hover:w-full"></span>
              </Link>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <select
            className="appearance-none bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold pr-12 pl-10 py-2 rounded-full cursor-pointer shadow-lg hover:shadow-orange-500/50 transition-all duration-300 outline-none"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            aria-label="Select location"
          >
            <option className="text-black bg-white" value="Tolvsrød">
              Tolvsrød
            </option>
            <option className="text-black bg-white" value="Sentrum">
              Sentrum
            </option>
            <option className="text-black bg-white" value="Teie">
              Teie
            </option>
          </select>
          <MapPin
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none"
            size={18}
          />
          <motion.div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none"
            animate={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link href="/cart" className="relative group">
              <ShoppingCart className="h-6 w-6 text-white transition-transform duration-300 group-hover:text-orange-400" />
              {cartProducts.length > 0 && (
                <motion.span
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-orange-500 text-white rounded-full text-xs font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {cartProducts.length}
                </motion.span>
              )}
            </Link>
          </motion.div>
          <div className="hidden md:flex items-center gap-4">
            {status === "authenticated" ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={"/profile"}>
                    <span className="text-2xl font-medium text-white hover:text-orange-400 transition-colors">
                      {userName}
                    </span>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => signOut()}
                    className="bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300 rounded-full px-6 py-2 text-sm font-semibold shadow-lg hover:shadow-orange-500/50"
                  >
                    Logg ut
                  </Button>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/login"
                    className="text-white hover:text-orange-400 transition-colors font-medium"
                  >
                    Logg inn
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    className="bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300 rounded-full px-6 py-2 text-sm font-semibold shadow-lg hover:shadow-orange-500/50"
                  >
                    <Link href="/register">Registrer</Link>
                  </Button>
                </motion.div>
              </>
            )}
          </div>
          <motion.button
            className={`p-2 rounded-full bg-gray-800/50 text-white hover:bg-gray-700/50 transition-colors md:hidden z-50`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </nav>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-start justify-between px-4 py-5 bg-black/95 backdrop-blur-lg"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex items-center justify-between w-full">
              <Link
                href="/"
                className="flex items-center space-x-2 text-3xl font-extrabold text-white"
                onClick={closeMenu}
              >
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={100}
                  height={100}
                  className="filter drop-shadow-lg"
                />
              </Link>
            </div>
            <div className="flex flex-col space-y-6 mt-12 w-full">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  variants={linkVariants}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="text-4xl font-bold text-white hover:text-orange-400 transition-colors block"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="flex flex-col w-full mt-8 space-y-4">
              {status === "authenticated" ? (
                <>
                  <Link href={"/profile"}>
                    <span className="text-2xl font-medium text-white hover:text-orange-400 transition-colors">
                      {userName}
                    </span>
                  </Link>
                  <Button
                    onClick={() => {
                      signOut();
                      closeMenu();
                    }}
                    className="bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300 rounded-full px-6 py-3 w-full text-lg font-semibold shadow-lg hover:shadow-orange-500/50"
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
                    className="w-full text-white hover:text-orange-400 text-lg font-semibold"
                  >
                    <Link href="/login">Logg inn</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300 rounded-full px-6 py-3 w-full text-lg font-semibold shadow-lg hover:shadow-orange-500/50"
                    onClick={closeMenu}
                  >
                    <Link href="/register">Registrer</Link>
                  </Button>
                </>
              )}
              <div className="flex space-x-6 justify-center mt-6">
                <motion.a
                  href="#"
                  className="text-white hover:text-orange-400 transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Facebook size={28} />
                </motion.a>
                <motion.a
                  href="#"
                  className="text-white hover:text-orange-400 transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Instagram size={28} />
                </motion.a>
                <motion.a
                  href="#"
                  className="text-white hover:text-orange-400 transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Youtube size={28} />
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
