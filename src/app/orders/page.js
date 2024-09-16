"use client";

import { useEffect, useState } from "react";
import UserTabs from "@/components/layout/UserTabs";
import { UseProfile } from "@/components/UseProfile";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClipboardList, Eye, Truck, Store } from "lucide-react";
import { dbTimeForHuman } from "@/libs/datetime";
import { Input } from "@/components/ui/input";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { loading, data: profile } = UseProfile();

  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [isDateRange, setIsDateRange] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [startDate, endDate, isDateRange]);

  function fetchOrders() {
    setLoadingOrders(true);

    const queryParams = new URLSearchParams();
    if (startDate) {
      queryParams.append("startDate", new Date(startDate).toISOString());
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      queryParams.append("endDate", end.toISOString());
    }

    fetch(`/api/orders?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((orders) => {
        const sortedOrders = orders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
        setLoadingOrders(false);
      });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex flex-col md:flex-row">
        <div className="md:w-64 md:flex-shrink-0">
          <UserTabs isAdmin={profile.admin} />
        </div>
        <main className="flex-grow p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <ClipboardList className="w-6 h-6" />
                  Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4 items-start mb-4">
                  {isDateRange ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Start Date
                        </label>
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          End Date
                        </label>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          setEndDate(e.target.value);
                        }}
                        className="mt-1"
                      />
                    </div>
                  )}
                  <Button
                    onClick={() => setIsDateRange(!isDateRange)}
                    variant="secondary"
                  >
                    {isDateRange ? "Select Single Date" : "Select Date Range"}
                  </Button>
                </div>

                {loadingOrders ? (
                  <div className="text-center py-4">Loading orders...</div>
                ) : orders?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Status</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>
                              <div
                                className={`px-3 py-1 rounded-full text-white text-sm font-medium inline-block shadow-md transition-all duration-200 ease-in-out ${
                                  order.paid
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-red-500 hover:bg-red-600"
                                }`}
                              >
                                {order.paid ? "Paid" : "Unpaid"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {order.streetAddress ? (
                                  <Truck className="w-4 h-4 mr-2 text-blue-500" />
                                ) : (
                                  <Store className="w-4 h-4 mr-2 text-orange-500" />
                                )}
                                {order.streetAddress ? "Delivery" : "Pickup"}
                              </div>
                            </TableCell>
                            <TableCell>
                              {order.name ? order.name.split(" ")[0] : "N/A"}
                            </TableCell>
                            <TableCell>
                              {dbTimeForHuman(order.createdAt)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button asChild variant="outline" size="sm">
                                <Link href={`/orders/${order._id}`}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Show order
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No orders found
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
