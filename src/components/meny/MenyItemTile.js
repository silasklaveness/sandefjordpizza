import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import AddToCartButton from "./AddToCartButton";

export default function MenyItemTile({ onAddToCart, ...item }) {
  const { image, description, name, basePrice, sizes, extraIngredientsPrices } =
    item;
  const hasSizesOrExtras =
    sizes?.length > 0 || extraIngredientsPrices?.length > 0;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full"
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image}
          layout="fill"
          objectFit="cover"
          alt={name}
          className="transition-transform duration-300 transform hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 opacity-0 hover:opacity-100" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h4 className="font-bold text-xl mb-2 text-gray-800">{name}</h4>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {description}
        </p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
        >
          <AddToCartButton
            hasSizesOrExtras={hasSizesOrExtras}
            onClick={onAddToCart}
            basePrice={basePrice}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
