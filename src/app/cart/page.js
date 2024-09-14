"use client";

import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CartContext, cartProductPrice } from "@/components/AppContext";
import SectionHeaders from "@/components/layout/SectionHeaders";
import AddressInputs from "@/components/layout/AddressInputs";
import { UseProfile } from "@/components/UseProfile";
import CartProduct from "@/components/meny/CartProduct";
import toast from "react-hot-toast";
import {
  ShoppingCart,
  AlertCircle,
  ChevronLeft,
  CreditCard,
} from "lucide-react";

const isMobile = () => {
  return typeof window !== "undefined" && window.innerWidth <= 768;
};

export default function CartPage() {
  const { cartProducts, removeCartProduct, clearCart } =
    useContext(CartContext);
  const [address, setAddress] = useState({});
  const { data: profileData } = UseProfile();
  const [showCheckout, setShowCheckout] = useState(false);
  const [isMobileView, setIsMobileView] = useState(isMobile());

  useEffect(() => {
    if (profileData?.city) {
      const { phone, streetAddress, city, postalCode, country } = profileData;
      setAddress({ phone, streetAddress, city, postalCode, country });
    }
  }, [profileData]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = isMobile();
      setIsMobileView(mobile);
      if (!mobile) {
        setShowCheckout(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const subtotal = cartProducts.reduce(
    (sum, p) => sum + cartProductPrice(p),
    0
  );

  function handleAddressChange(propName, value) {
    setAddress((prev) => ({ ...prev, [propName]: value }));
  }

  async function proceedToCheckout(ev) {
    ev.preventDefault();
    const promise = new Promise((resolve, reject) => {
      fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, cartProducts }),
      }).then(async (response) => {
        if (response.ok) {
          resolve();
          window.location = await response.json();
          clearCart();
          setShowCheckout(false);
        } else {
          reject();
        }
      });
    });
    await toast.promise(promise, {
      loading: "Preparing your order...",
      success: "Redirecting to payment...",
      error: "Something went wrong, please try again later!",
    });
  }

  if (cartProducts?.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8 text-center px-4"
      >
        <SectionHeaders mainHeader="Your cart" />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-8 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg shadow-lg p-8"
        >
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-yellow-600 mr-3" />
            <p className="text-lg font-semibold text-yellow-800">
              Your cart is empty
            </p>
          </div>
          <p className="text-yellow-700">
            Add some delicious items to get started!
          </p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.4,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <ShoppingCart className="w-32 h-32 mx-auto mt-8 text-yellow-400" />
          </motion.div>
        </motion.div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-8 px-4 max-w-6xl mx-auto"
    >
      <div className="text-center mb-8">
        <SectionHeaders mainHeader="Your cart" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Cart Items */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <AnimatePresence>
            {cartProducts.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CartProduct
                  product={product}
                  onRemove={removeCartProduct}
                  index={index}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="py-4 flex items-center justify-between border-t mt-4"
          >
            <div className="text-gray-600">
              <p>Subtotal:</p>
              <p>Delivery:</p>
              <p className="font-semibold text-lg">Total:</p>
            </div>
            <div className="text-right">
              <p>{subtotal}KR</p>
              <p>5KR</p>
              <p className="font-semibold text-lg">{subtotal + 5}KR</p>
            </div>
          </motion.div>
          {isMobileView && !showCheckout && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCheckout(true)}
              className="mt-6 w-full bg-gradient-to-r from-primary to-primary-dark text-white py-3 px-4 rounded-md hover:from-primary-dark hover:to-primary transition-all duration-300 flex items-center justify-center"
            >
              Next {subtotal + 5} KR
            </motion.button>
          )}
        </motion.div>

        {/* Checkout Section */}
        {(!isMobileView || showCheckout) && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-50 p-6 rounded-lg shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Checkout</h2>
              {isMobileView && (
                <button
                  onClick={() => setShowCheckout(false)}
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ChevronLeft className="mr-1" />
                  Back
                </button>
              )}
            </div>
            <form onSubmit={proceedToCheckout}>
              <AddressInputs
                addressProps={address}
                setAddressProps={handleAddressChange}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="mt-6 w-full bg-gradient-to-r from-primary to-primary-dark text-white py-3 px-4 rounded-md hover:from-primary-dark hover:to-primary transition-all duration-300 flex items-center justify-center"
              >
                <CreditCard className="mr-2" />
                Pay {subtotal + 5} KR
              </motion.button>
            </form>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
