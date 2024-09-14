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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  ArrowUp,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Calendar,
} from "lucide-react";

export default function AnalyticsPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { loading, data: profile } = UseProfile();

  // Initialize dates
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [isDateRange, setIsDateRange] = useState(false); // Toggle between single date and date range

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    setLoadingOrders(true);

    const queryParams = new URLSearchParams();
    if (startDate) {
      queryParams.append("startDate", new Date(startDate).toISOString());
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the entire end date
      queryParams.append("endDate", end.toISOString());
    }

    fetch(`/api/orders?${queryParams.toString()}`)
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

  if (!profile.admin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">
          Access Denied. You do not have permission to view this page.
        </p>
      </div>
    );
  }

  // Compute analytics
  const totalEarned = orders.reduce((sum, order) => {
    if (order.paid) {
      return (
        sum +
        order.cartProducts.reduce((acc, product) => {
          const basePrice = product.basePrice || 0;
          const sizePrice = product.selectedSize?.price || 0;
          const extrasPrice =
            product.selectedExtras?.reduce(
              (sum, extra) => sum + (extra.price || 0),
              0
            ) || 0;
          return (
            acc +
            (basePrice + sizePrice + extrasPrice) * (product.quantity || 1)
          );
        }, 0)
      );
    }
    return sum;
  }, 0);

  const totalOrders = orders.length;
  const averageOrderValue = totalEarned / totalOrders || 0;

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
      const productTotal =
        (product.basePrice || 0) +
        (product.selectedSize?.price || 0) +
        (product.selectedExtras?.reduce(
          (sum, extra) => sum + (extra.price || 0),
          0
        ) || 0);
      productSales[product.name].quantity += product.quantity || 1;
      productSales[product.name].revenue +=
        productTotal * (product.quantity || 1);
    });
  });

  const bestSellingProducts = Object.values(productSales).sort(
    (a, b) => b.quantity - a.quantity
  );

  // Prepare data for revenue over time chart
  const revenueData = orders
    .filter((order) => order.paid)
    .map((order) => ({
      date: dbTimeForHuman(order.createdAt).substring(0, 10), // Get date in "YYYY-MM-DD" format
      amount: order.cartProducts.reduce((acc, product) => {
        const productTotal =
          (product.basePrice || 0) +
          (product.selectedSize?.price || 0) +
          (product.selectedExtras?.reduce(
            (sum, extra) => sum + (extra.price || 0),
            0
          ) || 0);
        return acc + productTotal * (product.quantity || 1);
      }, 0),
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

  // Prepare data for pie chart
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#A28CFE",
    "#FEA8A8",
    "#8FE8A0",
    "#F0A0FF",
    "#FFA07A",
  ];
  const pieChartData = bestSellingProducts.map((product, index) => ({
    name: product.name,
    value: product.quantity,
    color: COLORS[index % COLORS.length],
  }));

  // Peak hours analysis (adjusted for Norwegian time)
  const ordersByHour = Array(24).fill(0);

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const norwegianHour = (date.getUTCHours() + 1) % 24; // Adjust for Norwegian time (UTC+1)
    ordersByHour[norwegianHour] += 1;
  });

  const hourlyData = ordersByHour.map((count, hour) => ({
    hour,
    count,
  }));

  // Top customers
  const customerSales = {};

  orders.forEach((order) => {
    if (!order.userEmail) return;
    const email = order.userEmail;
    if (!customerSales[email]) {
      customerSales[email] = {
        email,
        totalSpent: 0,
        orders: 0,
      };
    }
    const orderTotal = order.cartProducts.reduce((acc, product) => {
      const productTotal =
        (product.basePrice || 0) +
        (product.selectedSize?.price || 0) +
        (product.selectedExtras?.reduce(
          (sum, extra) => sum + (extra.price || 0),
          0
        ) || 0);
      return acc + productTotal * (product.quantity || 1);
    }, 0);
    customerSales[email].totalSpent += orderTotal;
    customerSales[email].orders += 1;
  });

  const topCustomers = Object.values(customerSales).sort(
    (a, b) => b.totalSpent - a.totalSpent
  );

  return (
    <section className="max-w-6xl mx-auto p-4 mt-[80px]">
      <UserTabs isAdmin={profile.admin} />

      {/* Date Selection */}
      <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4 items-start mb-4">
        {isDateRange ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setEndDate(e.target.value); // Ensure endDate matches startDate
              }}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
        )}
        <button
          onClick={() => setIsDateRange(!isDateRange)}
          className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-md"
        >
          {isDateRange ? "Select Single Date" : "Select Date Range"}
        </button>
        <button
          onClick={fetchOrders}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Apply
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {/* Total Earned */}
        <Card>
          <CardContent className="flex items-center p-6">
            <DollarSign className="h-8 w-8 text-green-500 mr-4" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Earned
              </p>
              <h3 className="text-2xl font-bold">
                {totalEarned.toFixed(2)} KR
              </h3>
            </div>
          </CardContent>
        </Card>
        {/* Total Orders */}
        <Card>
          <CardContent className="flex items-center p-6">
            <ShoppingCart className="h-8 w-8 text-blue-500 mr-4" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Orders
              </p>
              <h3 className="text-2xl font-bold">{totalOrders}</h3>
            </div>
          </CardContent>
        </Card>
        {/* Average Order Value */}
        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-purple-500 mr-4" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Average Order Value
              </p>
              <h3 className="text-2xl font-bold">
                {averageOrderValue.toFixed(2)} KR
              </h3>
            </div>
          </CardContent>
        </Card>
        {/* Top Product */}
        <Card>
          <CardContent className="flex items-center p-6">
            <ArrowUp className="h-8 w-8 text-red-500 mr-4" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Top Product
              </p>
              <h3 className="text-2xl font-bold">
                {bestSellingProducts[0]?.name || "N/A"}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Revenue Over Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toFixed(2)} KR`} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Product Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Product Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name }) => name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  payload={pieChartData.map((item) => ({
                    value: item.name,
                    type: "square",
                    color: item.color,
                  }))}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Peak Hours Analysis */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Peak Ordering Hours (Norwegian Time)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
                label={{
                  value: "Hour (Norwegian Time)",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Total Spent</TableCell>
                <TableCell>Orders</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topCustomers.slice(0, 5).map((customer) => (
                <TableRow key={customer.email}>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.totalSpent.toFixed(2)} KR</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Best Selling Products */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Best Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <TableCell>{product.revenue.toFixed(2)} KR</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
