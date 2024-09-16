"use client";

import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CartContext, cartProductPrice } from "@/components/AppContext";
import SectionHeaders from "@/components/layout/SectionHeaders";
import CheckoutInputs from "@/components/layout/CheckoutInputs";
import { UseProfile } from "@/components/UseProfile";
import CartProduct from "@/components/meny/CartProduct";
import MenyItemPopup from "@/components/meny/MenyItemPopup";
import toast from "react-hot-toast";
import {
  ShoppingCart,
  AlertCircle,
  ChevronLeft,
  CreditCard,
  ArrowRight,
  Car,
  HandCoins,
} from "lucide-react";

export default function CartPage() {
  const { cartProducts, removeCartProduct, setCartProducts } =
    useContext(CartContext);
  const [address, setAddress] = useState({});
  const { data: profileData } = UseProfile();
  const [step, setStep] = useState("summary");
  const [editingProductIndex, setEditingProductIndex] = useState(null);
  const [deliveryOption, setDeliveryOption] = useState("pickup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Use profile data only to initialize name, email, and address, not to overwrite manual entries
  useEffect(() => {
    if (profileData) {
      if (profileData.name && !name) {
        setName(profileData.name);
      }
      if (profileData.email && !email) {
        setEmail(profileData.email);
      }
      if (profileData.streetAddress && !address.streetAddress) {
        const { phone, streetAddress, city, postalCode, country } = profileData;
        setAddress({ phone, streetAddress, city, postalCode, country });
      }
    }
  }, [profileData, name, email, address]);

  const subtotal = cartProducts.reduce(
    (sum, p) => sum + cartProductPrice(p) * p.quantity,
    0
  );

  const deliveryFee = deliveryOption === "delivery" ? 75 : 0;
  const total = subtotal + deliveryFee;

  const handleUpdateQuantity = (index, newQuantity) => {
    setCartProducts((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[index].quantity = newQuantity;
      return updatedCart;
    });
  };

  const handleEditProduct = (index, updatedProduct) => {
    setCartProducts((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[index] = updatedProduct;
      return updatedCart;
    });
    setEditingProductIndex(null);
  };

  function handleAddressChange(propName, value) {
    setAddress((prev) => ({ ...prev, [propName]: value }));
  }

  async function proceedToCheckout(ev) {
    ev.preventDefault();

    if (deliveryOption === "delivery" && subtotal < 200) {
      toast.error("Minimum order for delivery is 200 KR");
      return;
    }

    if (!name || !email || !address.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (
      deliveryOption === "delivery" &&
      (!address.streetAddress || !address.city || !address.postalCode)
    ) {
      toast.error("Please fill in all address fields for delivery");
      return;
    }

    const promise = new Promise((resolve, reject) => {
      fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          cartProducts,
          deliveryOption,
          name, // Use the name from state, not profileData
          email, // Use the email from state, not profileData
        }),
      }).then(async (response) => {
        if (response.ok) {
          resolve();
          window.location = await response.json();
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
        className="md:mt-8 text-center px-4"
      >
        <SectionHeaders mainHeader="Your cart" />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-8 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg shadow-lg p-4 sm:p-8"
        >
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 mr-2 sm:mr-3" />
            <p className="text-base sm:text-lg font-semibold text-yellow-800">
              Handlekurv tom
            </p>
          </div>
          <p className="text-sm sm:text-base text-yellow-700">
            Gå til meny for å legge til nye retter.
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
            <ShoppingCart className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mt-6 sm:mt-8 text-yellow-400" />
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
      className="mt-20 sm:mt-[140px] px-4 max-w-2xl mx-auto"
    >
      <div className="text-center mb-6 sm:mb-8">
        <SectionHeaders mainHeader="Your cart" />
      </div>

      <AnimatePresence mode="wait">
        {step === "summary" && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              Order Summary
            </h2>
            <div className="space-y-4">
              {cartProducts.map((product, index) => (
                <CartProduct
                  key={index}
                  product={product}
                  onRemove={removeCartProduct}
                  index={index}
                  onUpdateQuantity={handleUpdateQuantity}
                  onEditProduct={(updatedProduct) =>
                    handleEditProduct(index, updatedProduct)
                  }
                  onEdit={() => setEditingProductIndex(index)}
                />
              ))}
            </div>
            <div className="py-4 flex items-center justify-between border-t mt-4">
              <div className="text-sm sm:text-base text-gray-600">
                <p>Subtotal:</p>
                <p>Delivery:</p>
                <p className="font-semibold text-base sm:text-lg">Total:</p>
              </div>
              <div className="text-right text-sm sm:text-base">
                <p>{subtotal} KR</p>
                <p>{deliveryFee} KR</p>
                <p className="font-semibold text-base sm:text-lg">{total} KR</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Choose delivery option:</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeliveryOption("pickup")}
                  className={`flex-1 p-4 rounded-lg border-2 ${
                    deliveryOption === "pickup"
                      ? "border-primary bg-primary/10"
                      : "border-gray-200"
                  } transition-all duration-200`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <HandCoins className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-semibold">Hente selv</h4>
                  <p className="text-sm text-gray-500">Klar på ca 15 min</p>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeliveryOption("delivery")}
                  className={`flex-1 p-4 rounded-lg border-2 ${
                    deliveryOption === "delivery"
                      ? "border-primary bg-primary/10"
                      : "border-gray-200"
                  } transition-all duration-200`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <Car className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-semibold">Levering</h4>
                  <p className="text-sm text-gray-500">Kun ordre over 200 kr</p>
                  <p className="text-sm font-semibold">75 kr</p>
                </motion.button>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep("checkout")}
              className="mt-6 w-full bg-gradient-to-r from-primary to-primary-dark text-white py-3 px-4 rounded-md hover:from-primary-dark hover:to-primary transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
            >
              Proceed to Checkout
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </motion.div>
        )}

        {step === "checkout" && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">Checkout</h2>
              <button
                onClick={() => setStep("summary")}
                className="flex items-center text-sm sm:text-base text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ChevronLeft className="mr-1 w-4 h-4 sm:w-5 sm:h-5" />
                Back to Order
              </button>
            </div>
            <form onSubmit={proceedToCheckout}>
              <CheckoutInputs
                addressProps={address}
                setAddressProps={handleAddressChange}
                deliveryOption={deliveryOption}
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="mt-6 w-full bg-gradient-to-r from-primary to-primary-dark text-white py-3 px-4 rounded-md hover:from-primary-dark hover:to-primary transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
              >
                <CreditCard className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Pay {total} KR
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {editingProductIndex !== null && (
        <MenyItemPopup
          product={cartProducts[editingProductIndex]}
          onClose={() => setEditingProductIndex(null)}
          onSubmit={(updatedProduct) =>
            handleEditProduct(editingProductIndex, updatedProduct)
          }
        />
      )}
    </motion.section>
  );
}
