"use client";

import { useContext, useState } from "react";
import { CartContext } from "../AppContext";
import { toast } from "react-hot-toast";
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
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="relative">
          <Image
            src={image}
            alt={name}
            width={400}
            height={300}
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-lg font-bold">
            {basePrice},-
          </div>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2 uppercase">{name}</h2>
          <p className="text-gray-600 mb-4 text-sm">{description}</p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">FRA {basePrice}KR</span>
            <Button
              onClick={handleAddToCartButtonClick}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Legg til
            </Button>
          </div>
        </div>
      </div>

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
                          className="border-blue-500 text-blue-500"
                        />
                        <Label
                          htmlFor={size.name}
                          className="text-gray-700 dark:text-gray-300"
                        >
                          {size.name} {basePrice + size.price}KR
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
                        className="border-blue-500 text-blue-500"
                      />
                      <Label
                        htmlFor={extraThing.name}
                        className="text-gray-700 dark:text-gray-300"
                      >
                        {extraThing.name} {extraThing.price}KR
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
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Add to cart ${selectedPrice}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
