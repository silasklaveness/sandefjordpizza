"use client";

import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CartContext } from "@/components/AppContext";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Loader2,
  AlertCircle,
  Package,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Clock,
  Store,
} from "lucide-react";

export default function OrderPage() {
  const { clearCart } = useContext(CartContext);
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.href.includes("clear-cart=1")) {
        clearCart();
        window.location.href = window.location.href.replace("clear-cart=1", "");
      }
    }
    if (id) {
      setLoadingOrder(true);
      fetch("/api/orders?_id=" + id)
        .then((res) => res.json())
        .then((orderData) => {
          console.log("Fetched order data:", orderData);
          setOrder(orderData[0]); // Set the first order from the array
          setLoadingOrder(false);
        })
        .catch((error) => {
          console.error("Error fetching order:", error);
          setLoadingOrder(false);
        });
    }
  }, [id, clearCart]);

  if (loadingOrder) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Order Not Found
        </h2>
        <p className="text-gray-600">
          We couldnt find the order youre looking for.
        </p>
      </div>
    );
  }

  const isDeliveryOrder = order.streetAddress && order.city && order.country;

  const subtotal =
    order.cartProducts && order.cartProducts.length > 0
      ? order.cartProducts.reduce((sum, product) => {
          const basePrice = product.basePrice || 0;
          const sizePrice = product.selectedSize?.price || 0;
          const extrasPrice =
            product.selectedExtras?.reduce(
              (sum, extra) => sum + (extra.price || 0),
              0
            ) || 0;
          return (
            sum +
            (basePrice + sizePrice + extrasPrice) * (product.quantity || 1)
          );
        }, 0)
      : 0;

  const deliveryFee = isDeliveryOrder ? 5 : 0;
  const total = subtotal + deliveryFee;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto mt-8 px-4"
    >
      <div className="text-center mb-8">
        <SectionHeaders mainHeader="Order Confirmation" />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="mt-4"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700">
            Takk for din bestilling!
          </h2>
          <p className="text-gray-600 mt-2">
            {isDeliveryOrder
              ? "Vi ringer deg når din bestilling er på vei."
              : "Vi ringer deg når din bestilling er klar for henting."}
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid md:grid-cols-2 gap-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-gray-500" />
                {order.userEmail}
              </li>
              {order.name && (
                <li className="flex items-center">
                  <Package className="w-5 h-5 mr-2 text-gray-500" />
                  {order.name}
                </li>
              )}
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-gray-500" />
                {order.phone}
              </li>
            </ul>
            <Separator className="my-4" />
            {isDeliveryOrder ? (
              <>
                <h3 className="font-semibold mb-2">Delivery Address</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                    {order.streetAddress}
                  </li>
                  <li className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-gray-500 opacity-0" />
                    {order.postalCode} {order.city}
                  </li>
                  <li className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-gray-500 opacity-0" />
                    {order.country}
                  </li>
                </ul>
              </>
            ) : (
              <>
                <h3 className="font-semibold mb-2">Pickup Information</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Store className="w-5 h-5 mr-2 text-gray-500" />
                    Pickup at our store
                  </li>
                  <li className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-gray-500" />
                    Estimated pickup time:{" "}
                    {new Date(order.createdAt).getTime() + 30 * 60000 >
                    new Date().getTime()
                      ? "30 minutes"
                      : "Ready for pickup"}
                  </li>
                </ul>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {order.cartProducts && order.cartProducts.length > 0 ? (
              <ul className="space-y-4">
                {order.cartProducts.map((product, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{product.name}</span>
                      {product.selectedSize && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({product.selectedSize.name})
                        </span>
                      )}
                      {product.selectedExtras &&
                        product.selectedExtras.length > 0 && (
                          <span className="text-sm text-gray-500 ml-2">
                            (+
                            {product.selectedExtras
                              .map((extra) => extra.name)
                              .join(", ")}
                            )
                          </span>
                        )}
                      <span className="text-sm text-gray-500 ml-2">
                        x{product.quantity || 1}
                      </span>
                    </div>
                    <span className="font-medium">
                      {((product.basePrice || 0) +
                        (product.selectedSize?.price || 0) +
                        (product.selectedExtras?.reduce(
                          (sum, extra) => sum + (extra.price || 0),
                          0
                        ) || 0)) *
                        (product.quantity || 1).toFixed(2)}{" "}
                      KR
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No products in this order.</p>
            )}
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">{subtotal.toFixed(2)} KR</span>
              </div>
              {isDeliveryOrder && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery:</span>
                  <span className="font-semibold">
                    {deliveryFee.toFixed(2)} KR
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{total.toFixed(2)} KR</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8"
      >
        <Card>
          <CardContent className="p-6 bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="w-6 h-6 mr-2 text-green-600" />
                <span className="font-medium text-green-600">
                  Payment Status:
                </span>
              </div>
              <span className="font-medium text-green-600">
                {order.paid ? "Paid" : "Pending"}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Order placed on: {new Date(order.createdAt).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.section>
  );
}
