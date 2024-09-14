// pages/analytics.jsx

"use client";

import { useEffect, useState } from "react";
import { UseProfile } from "@/components/UseProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";

import { dbTimeForHuman } from "@/libs/datetime";
import UserTabs from "@/components/layout/UserTabs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { loading, data: profile } = UseProfile();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !profile.admin) {
      router.push("/"); // Redirect non-admins to home
    }
  }, [loading, profile, router]);

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    setLoadingOrders(true);
    fetch("/api/orders")
      .then((res) => res.json())
      .then((orders) => {
        setOrders(orders);
        setLoadingOrders(false);
      });
  }

  if (loading || loadingOrders) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Compute analytics
  const totalEarned = orders.reduce((sum, order) => {
    if (order.paid) {
      return (
        sum +
        order.cartProducts.reduce((acc, product) => acc + product.basePrice, 0)
      );
    }
    return sum;
  }, 0);

  // Best-selling products
  const productSales = {};
  orders.forEach((order) => {
    order.cartProducts.forEach((product) => {
      if (!productSales[product.name]) {
        productSales[product.name] = {
          name: product.name,
          quantity: 0,
          revenue: 0,
        };
      }
      productSales[product.name].quantity += 1;
      productSales[product.name].revenue += product.basePrice;
    });
  });

  const bestSellingProducts = Object.values(productSales).sort(
    (a, b) => b.quantity - a.quantity
  );

  // Prepare data for charts (revenue over time)
  const revenueData = orders
    .filter((order) => order.paid)
    .map((order) => ({
      date: dbTimeForHuman(order.createdAt, { dateOnly: true }),
      amount: order.cartProducts.reduce(
        (acc, product) => acc + product.basePrice,
        0
      ),
    }))
    .reduce((acc, curr) => {
      const existing = acc.find((item) => item.date === curr.date);
      if (existing) {
        existing.amount += curr.amount;
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);

  // Generate simple bar chart data (revenue over time)
  const maxRevenue = Math.max(...revenueData.map((data) => data.amount));
  const chartData = revenueData.map((data) => ({
    ...data,
    // Calculate bar height as a percentage
    percentage: (data.amount / maxRevenue) * 100,
  }));

  return (
    <section className="max-w-6xl mx-auto p-4 mt-[80px]">
      <UserTabs isAdmin={profile.admin} />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Analytics Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Total Earned */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Total Earned</h2>
              <p className="text-3xl font-bold">{totalEarned}</p>
            </div>

            {/* Best Selling Products */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                Best Selling Products
              </h2>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Quantity Sold</TableCell>
                    <TableCell>Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bestSellingProducts.slice(0, 5).map((product) => (
                    <TableRow key={product.name}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.revenue}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Revenue Over Time */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Revenue Over Time</h2>
            <div className="w-full overflow-x-auto">
              <div className="flex items-end space-x-2">
                {chartData.map((data, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <motion.div
                      className="bg-blue-500 w-full"
                      style={{ height: `${data.percentage}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${data.percentage}%` }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="text-xs mt-2 text-center">{data.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
