import Image from "next/image";
import { Trash, Minus, Plus, Edit2 } from "lucide-react";
import { cartProductPrice } from "../AppContext";
import { motion } from "framer-motion";
import { useState } from "react";
import MenyItemPopup from "./MenyItemPopup"; // Import the popup component

export default function CartProduct({
  product,
  onRemove,
  onUpdateQuantity,
  index,
  onEditProduct,
}) {
  const [showEditPopup, setShowEditPopup] = useState(false);

  // Handle quantity changes, and ensure quantity doesn't go below 1
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      onUpdateQuantity(index, newQuantity);
    } else if (newQuantity === 0) {
      onRemove(index);
    }
  };

  const handleEditProduct = (updatedProduct) => {
    onEditProduct(updatedProduct);
    setShowEditPopup(false); // Close the popup after editing
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 border-b pb-4"
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 relative rounded-lg overflow-hidden flex-shrink-0">
          <Image
            fill
            src={product.image}
            alt={product.name}
            className="object-cover"
            sizes="(max-width: 640px) 80px, 96px"
          />
        </div>
        <div className="grow">
          <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
          <div className="text-sm text-gray-500 space-y-1">
            {product.selectedSize && (
              <div>
                Size:{" "}
                <span className="font-medium">{product.selectedSize.name}</span>
              </div>
            )}
            {product.selectedExtras?.length > 0 && (
              <div>
                Extras:
                {product.selectedExtras.map((extra) => (
                  <span key={extra.name} className="ml-1">
                    {extra.name} ({extra.price}KR)
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0">
          <div className="text-lg font-semibold">
            {cartProductPrice(product)}KR
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleQuantityChange(product.quantity - 1)}
              className="md:ml-4 w-8 h-8 rounded-full border flex items-center justify-center transition-colors hover:bg-gray-100"
            >
              <Minus className="w-4 h-4" />
            </motion.button>
            <span className="w-8 text-center">{product.quantity}</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleQuantityChange(product.quantity + 1)}
              className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center transition-colors hover:bg-primary-dark"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowEditPopup(true)}
              className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
              type="button"
            >
              <Edit2 className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemove(index)}
              className="p-2 text-gray-500 hover:text-red-500 transition-colors"
              type="button"
            >
              <Trash className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Show the edit popup if the user clicks the Edit button */}
      {showEditPopup && (
        <MenyItemPopup
          product={product}
          onClose={() => setShowEditPopup(false)}
          onSubmit={handleEditProduct}
        />
      )}
    </>
  );
}
