"use client";

import { useContext, useState } from "react";
import { CartContext } from "../AppContext";
import { toast } from "react-hot-toast";
import MenuItemTile from "./MenyItemTile";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MenuItem(menuItem) {
  const { image, name, description, basePrice, sizes, extraIngredientsPrices } =
    menuItem;

  const [selectedSize, setSelectedSize] = useState(sizes[0] || null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const { addToCart } = useContext(CartContext);

  function handleAddToCartButtonClick() {
    const hasOptions = sizes.length > 0 && extraIngredientsPrices?.length > 0;
    if (hasOptions && !showPopup) {
      setShowPopup(true);
      return;
    }
    addToCart(menuItem, selectedSize, selectedExtras);
    setShowPopup(false);
    toast.success("Added to cart!");
  }

  function handleExtraThingClick(extraThing) {
    setSelectedExtras((prev) => {
      const exists = prev.find((e) => e.name === extraThing.name);
      if (exists) {
        return prev.filter((e) => e.name !== extraThing.name);
      } else {
        return [...prev, extraThing];
      }
    });
  }

  let selectedPrice = basePrice;
  if (selectedSize) {
    selectedPrice += selectedSize.price;
  }
  if (selectedExtras?.length > 0) {
    for (const extra of selectedExtras) {
      selectedPrice += extra.price;
    }
  }

  return (
    <>
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(100vh-200px)] pr-4">
            <div className="space-y-6">
              <Image
                src={image}
                alt={name}
                width={250}
                height={200}
                className="mx-auto rounded-lg shadow-md"
              />
              <p className="text-center text-gray-600 dark:text-gray-300">
                {description}
              </p>
              {sizes?.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
                    Pick your size
                  </h3>
                  <RadioGroup
                    value={selectedSize?.name}
                    onValueChange={(value) =>
                      setSelectedSize(sizes.find((s) => s.name === value))
                    }
                  >
                    {sizes.map((size) => (
                      <div
                        key={size.name}
                        className="flex items-center space-x-3 mb-2"
                      >
                        <RadioGroupItem
                          value={size.name}
                          id={size.name}
                          className="border-orange-500 text-orange-500"
                        />
                        <Label
                          htmlFor={size.name}
                          className="text-gray-700 dark:text-gray-300"
                        >
                          {size.name} ${basePrice + size.price}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
              {extraIngredientsPrices?.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
                    Any extras?
                  </h3>
                  {extraIngredientsPrices.map((extraThing) => (
                    <div
                      key={extraThing.name}
                      className="flex items-center space-x-3 mb-2"
                    >
                      <Checkbox
                        id={extraThing.name}
                        checked={selectedExtras.some(
                          (e) => e.name === extraThing.name
                        )}
                        onCheckedChange={() =>
                          handleExtraThingClick(extraThing)
                        }
                        className="border-orange-500 text-orange-500"
                      />
                      <Label
                        htmlFor={extraThing.name}
                        className="text-gray-700 dark:text-gray-300"
                      >
                        {extraThing.name} ${extraThing.price}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setShowPopup(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddToCartButtonClick}
              className="bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
            >
              Add to cart ${selectedPrice}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <MenuItemTile onAddToCart={handleAddToCartButtonClick} {...menuItem} />
    </>
  );
}
