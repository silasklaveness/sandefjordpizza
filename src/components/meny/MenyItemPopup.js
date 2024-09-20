import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function MenyItemPopup({
  product = {}, // Fallback to an empty object if product is undefined
  onClose,
  onSubmit,
  existingCartProduct = null, // For editing a cart product
}) {
  const {
    image = "",
    name = "",
    description = "",
    basePrice = 0,
    sizes = [],
    extraIngredientsPrices = [],
  } = product;

  const [selectedSize, setSelectedSize] = useState(sizes[0] || null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [quantity, setQuantity] = useState(1);

  // Pre-fill state if we are editing an existing cart product
  useEffect(() => {
    if (existingCartProduct) {
      setSelectedSize(existingCartProduct.selectedSize);
      setSelectedExtras(existingCartProduct.selectedExtras);
      setQuantity(existingCartProduct.quantity);
    } else {
      setSelectedSize(sizes[0] || null); // Reset to first size
      setSelectedExtras([]); // Reset extras
      setQuantity(1); // Reset quantity
    }
  }, [existingCartProduct, sizes, product]);

  let selectedPrice = basePrice;
  if (selectedSize) {
    selectedPrice += selectedSize.price;
  }
  if (selectedExtras.length > 0) {
    selectedExtras.forEach((extra) => {
      selectedPrice += extra.price;
    });
  }

  function handleSubmit() {
    const updatedProduct = {
      ...product,
      selectedSize,
      selectedExtras,
      quantity,
    };
    onSubmit(updatedProduct);
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white ">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 ">
            {name}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh-200px)] pr-4">
          <div className="space-y-6">
            {image && (
              <Image
                src={image}
                alt={name}
                width={250}
                height={200}
                className="mx-auto rounded-lg shadow-md"
              />
            )}
            <p className="text-center text-gray-600 ">{description}</p>
            {sizes?.length > 0 && (
              <div className="bg-gray-50  p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-gray-800 ">
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
                      <Label htmlFor={size.name} className="text-gray-700">
                        {size.name} {basePrice + size.price}KR
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
            {extraIngredientsPrices?.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-gray-800">
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
                        setSelectedExtras((prev) =>
                          prev.some((e) => e.name === extraThing.name)
                            ? prev.filter((e) => e.name !== extraThing.name)
                            : [...prev, extraThing]
                        )
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

            {/* Quantity Selector */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
                Quantity
              </h3>
              <div className="flex items-center">
                {/* Minus button */}
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full border flex items-center justify-center"
                >
                  <span className="text-xl">−</span>
                </button>

                {/* Quantity Display */}
                <span className="mx-4">{quantity}</span>

                {/* Plus button */}
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center"
                >
                  <span className="text-xl">+</span>
                </button>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 "
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {existingCartProduct ? "Update" : "Add to cart"}{" "}
            {selectedPrice * quantity} KR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
