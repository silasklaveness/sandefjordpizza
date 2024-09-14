"use client";

import SectionHeaders from "@/components/layout/SectionHeaders";
import { useEffect, useState } from "react";
import UserTabs from "@/components/layout/UserTabs";
import { UseProfile } from "@/components/UseProfile";
import { dbTimeForHuman } from "@/libs/datetime";
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
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Eye } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { loading, data: profile } = UseProfile();

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    setLoadingOrders(true);
    fetch("/api/orders").then((res) => {
      res.json().then((orders) => {
        setOrders(orders.reverse());
        setLoadingOrders(false);
      });
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
    <section className="max-w-4xl mx-auto p-4">
      <UserTabs isAdmin={profile.admin} />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="w-6 h-6" />
            Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingOrders ? (
            <div className="text-center py-4">Loading orders...</div>
          ) : orders?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      <Badge variant={order.paid ? "success" : "destructive"}>
                        {order.paid ? "Paid" : "Not paid"}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.userEmail}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {order.cartProducts.map((p) => p.name).join(", ")}
                    </TableCell>
                    <TableCell>{dbTimeForHuman(order.createdAt)}</TableCell>
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
          ) : (
            <div className="text-center py-4 text-gray-500">
              No orders found
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
