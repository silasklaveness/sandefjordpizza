"use client";
import { CartContext, cartProductPrice } from "@/components/AppContext";
import SectionHeaders from "@/components/layout/SectionHeaders";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import Trash from "@/components/icons/Trash";
import AddressInputs from "@/components/layout/AddressInputs";
import { UseProfile } from "@/components/UseProfile";
import ShoppingCart from "@/components/icons/ShoppingCart";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { cartProducts, removeCartProduct } = useContext(CartContext);
  const [address, setAddress] = useState({});
  const { data: profileData } = UseProfile();

  useEffect(() => {
    if (profileData?.city) {
      const { phone, streetAddress, city, postalCode, country } = profileData;
      const addressFromProfile = {
        phone,
        streetAddress,
        city,
        postalCode,
        country,
      };
      setAddress(addressFromProfile);
    }
  }, [profileData]);

  let subtotal = 0;
  for (const p of cartProducts) {
    subtotal += cartProductPrice(p);
  }
  function handleAddressChange(propName, value) {
    setAddress((prevAddress) => ({ ...prevAddress, [propName]: value }));
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <SectionHeaders mainHeader="Your cart" />
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          {cartProducts?.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-xl font-semibold text-gray-600">
                Handlekurven er tom.
              </p>
              <Link
                href="/menu"
                className="mt-4 inline-block text-orange-500 hover:text-orange-600 font-medium"
              >
                Sjekk vår meny!
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">Din handlekurv</h2>
              <div className="space-y-4">
                {cartProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 bg-gray-50 rounded-lg p-4 relative"
                  >
                    <div className="w-24 h-24 relative rounded-md overflow-hidden">
                      <Image
                        fill
                        src={product.image}
                        alt={product.name}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <div className="text-sm text-gray-600 mt-1">
                        {product.size && (
                          <span className="mr-2">
                            Size:{" "}
                            <span className="font-medium">
                              {product.size.name}
                            </span>
                          </span>
                        )}
                        {product.extras?.length > 0 && (
                          <span>
                            Extras:{" "}
                            {product.extras
                              .map((extra) => extra.name)
                              .join(", ")}
                          </span>
                        )}
                      </div>
                      {product.extras?.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {product.extras.map((extra, i) => (
                            <span key={i} className="mr-2">
                              {extra.name} (+${extra.price})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">
                        {cartProductPrice(product)}KR
                      </div>
                      <button
                        onClick={() => removeCartProduct(index)}
                        className="text-red-500 hover:text-red-600 transition-colors mt-2"
                        aria-label={`Remove ${product.name} from cart`}
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex-row border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Subtotal:</span>
                  <span className="text-2xl font-bold">{subtotal}KR</span>
                  <span className="text-gray-600 font-medium">Delivery:</span>
                  <span className="text-2xl font-bold">KR 5</span>
                </div>
              </div>
            </>
          )}
        </div>
        <div>
          <AddressInputs
            addressProps={address}
            setAddressProps={handleAddressChange}
          />
          <div className="mt-8">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full transition-colors text-lg font-semibold">
              Pay {subtotal}KR
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
