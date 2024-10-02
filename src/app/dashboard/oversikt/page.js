"use client";

import { useEffect, useState } from "react";
import { UseProfile } from "@/components/UseProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserTabs from "@/components/layout/UserTabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  Area,
  ComposedChart,
} from "recharts";
import { ArrowUp, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LogoLoader from "@/components/ui/logoloader";

export default function AnalyticsPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { loading, data: profile } = UseProfile();

  const [startDate, setStartDate] = useState(getLastWeekStart());
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isDateRange, setIsDateRange] = useState(false);
  const [dateRangeType, setDateRangeType] = useState("last-week");

  useEffect(() => {
    fetchOrders();
  }, [startDate, endDate]);

  function fetchOrders() {
    setLoadingOrders(true);

    const queryParams = new URLSearchParams();
    queryParams.append("startDate", new Date(startDate).toISOString());
    queryParams.append("endDate", new Date(endDate).toISOString());

    fetch(`/api/orders?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((orders) => {
        setOrders(orders);
        setLoadingOrders(false);
      });
  }

  function getLastWeekStart() {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split("T")[0];
  }

  function getLast30DaysStart() {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split("T")[0];
  }

  function handleDateRangeChange(type) {
    const today = new Date();
    let start;
    let end = today.toISOString().split("T")[0];

    switch (type) {
      case "today":
        start = end;
        break;
      case "last-week":
        start = getLastWeekStart();
        break;
      case "last-30-days":
        start = getLast30DaysStart();
        break;
      case "custom":
        setIsDateRange(true);
        setDateRangeType("custom");
        return;
      default:
        start = getLastWeekStart();
    }

    setStartDate(start);
    setEndDate(end);
    setDateRangeType(type);
    setIsDateRange(false);
  }

  if (loading || loadingOrders) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LogoLoader size={75} color="#000000" />
        </div>
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

  const totalEarned = orders.reduce((sum, order) => {
    if (order.paid) {
      return sum + calculateOrderTotal(order);
    }
    return sum;
  }, 0);

  const totalOrders = orders.length;
  const averageOrderValue = totalEarned / totalOrders || 0;

  const productSales = calculateProductSales(orders);
  const bestSellingProducts = Object.values(productSales).sort(
    (a, b) => b.quantity - a.quantity
  );

  const revenueData = prepareRevenueData(orders, startDate, endDate);
  const hourlyData = prepareHourlyData(orders);
  const topCustomers = calculateTopCustomers(orders);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex flex-col md:flex-row">
        <div className="md:w-64 md:flex-shrink-0"></div>
        <main className="flex-grow p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            <DateSelection
              startDate={startDate}
              endDate={endDate}
              isDateRange={isDateRange}
              dateRangeType={dateRangeType}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              setIsDateRange={setIsDateRange}
              setDateRangeType={setDateRangeType}
              handleDateRangeChange={handleDateRangeChange}
              fetchOrders={fetchOrders}
            />

            <SummaryCards
              totalEarned={totalEarned}
              totalOrders={totalOrders}
              averageOrderValue={averageOrderValue}
              bestSellingProduct={bestSellingProducts[0]?.name || "N/A"}
            />

            <RevenueChart data={revenueData} dateRangeType={dateRangeType} />

            <PeakHoursChart data={hourlyData} />
            <TopCustomersTable customers={topCustomers} />
            <BestSellingProductsTable products={bestSellingProducts} />
          </div>
        </main>
      </div>
    </div>
  );
}

function DateSelection({
  startDate,
  endDate,
  isDateRange,
  dateRangeType,
  setStartDate,
  setEndDate,
  setIsDateRange,
  setDateRangeType,
  handleDateRangeChange,
  fetchOrders,
}) {
  return (
    <div className="flex flex-col space-y-4 mb-4">
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => handleDateRangeChange("today")}
          variant={dateRangeType === "today" ? "default" : "outline"}
        >
          Today
        </Button>
        <Button
          onClick={() => handleDateRangeChange("last-week")}
          variant={dateRangeType === "last-week" ? "default" : "outline"}
        >
          Last Week
        </Button>
        <Button
          onClick={() => handleDateRangeChange("last-30-days")}
          variant={dateRangeType === "last-30-days" ? "default" : "outline"}
        >
          Last 30 Days
        </Button>
        <Button
          onClick={() => handleDateRangeChange("custom")}
          variant={dateRangeType === "custom" ? "default" : "outline"}
        >
          Custom Date
        </Button>
      </div>
      {isDateRange && (
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label
              htmlFor="start-date"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="end-date"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button
            onClick={() => {
              setDateRangeType("custom");
              fetchOrders();
            }}
          >
            Apply Custom Range
          </Button>
        </div>
      )}
    </div>
  );
}

function SummaryCards({
  totalEarned,
  totalOrders,
  averageOrderValue,
  bestSellingProduct,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      <SummaryCard
        icon={<DollarSign className="h-8 w-8 text-green-500" />}
        title="Total Earned"
        value={`${totalEarned.toFixed(2)} KR`}
      />
      <SummaryCard
        icon={<ShoppingCart className="h-8 w-8 text-blue-500" />}
        title="Total Orders"
        value={totalOrders}
      />
      <SummaryCard
        icon={<TrendingUp className="h-8 w-8 text-purple-500" />}
        title="Average Order Value"
        value={`${averageOrderValue.toFixed(2)} KR`}
      />
      <SummaryCard
        icon={<ArrowUp className="h-8 w-8 text-red-500" />}
        title="Top Product"
        value={bestSellingProduct}
      />
    </div>
  );
}

function SummaryCard({ icon, title, value }) {
  return (
    <Card>
      <CardContent className="flex items-center p-6">
        <div className="mr-4">{icon}</div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

function RevenueChart({ data, dateRangeType }) {
  const maxRevenue = Math.max(...data.map((item) => item.amount));
  const yAxisDomain = [0, Math.ceil(maxRevenue * 1.1)];

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Detailed Revenue Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
            <XAxis
              dataKey="date"
              stroke="#888888"
              tick={{ fill: "#888888", fontSize: 12 }}
              tickLine={{ stroke: "#888888" }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return dateRangeType === "today"
                  ? `${date.getHours()}:00`
                  : `${date.getDate()}/${date.getMonth() + 1}`;
              }}
            />
            <YAxis
              yAxisId="left"
              stroke="#888888"
              tick={{ fill: "#888888", fontSize: 12 }}
              tickLine={{ stroke: "#888888" }}
              domain={yAxisDomain}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#82ca9d"
              tick={{ fill: "#82ca9d", fontSize: 12 }}
              tickLine={{ stroke: "#82ca9d" }}
              domain={[0, "dataMax + 10"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#f8f9fa",
                border: "1px solid #e9ecef",
              }}
              formatter={(value, name) => {
                if (name === "amount") {
                  return [`${value.toFixed(2)} KR`, "Revenue"];
                }
                if (name === "orders") {
                  return [value, "Orders"];
                }
                return [value, name];
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="amount"
              fill="#8884d8"
              stroke="#8884d8"
              yAxisId="left"
              fillOpacity={0.3}
              name="Revenue"
            />
            <Bar
              dataKey="orders"
              barSize={20}
              fill="#413ea0"
              yAxisId="right"
              name="Orders"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function PeakHoursChart({ data }) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Peak Ordering Hours (Norwegian Time)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
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
  );
}

function TopCustomersTable({ customers }) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Top Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Orders</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.slice(0, 5).map((customer) => (
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
  );
}

function BestSellingProductsTable({ products }) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Best Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Quantity Sold</TableHead>
              <TableHead>Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.slice(0, 5).map((product) => (
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
  );
}

function calculateOrderTotal(order) {
  return order.cartProducts.reduce((acc, product) => {
    const basePrice = product.basePrice || 0;
    const sizePrice = product.selectedSize?.price || 0;
    const extrasPrice =
      product.selectedExtras?.reduce(
        (sum, extra) => sum + (extra.price || 0),
        0
      ) || 0;
    return (
      acc + (basePrice + sizePrice + extrasPrice) * (product.quantity || 1)
    );
  }, 0);
}

function calculateProductSales(orders) {
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
  return productSales;
}

function prepareRevenueData(orders, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  let groupBy = 1; // Default to hourly for 'today'
  if (daysDiff > 1 && daysDiff <= 7) {
    groupBy = 1; // Daily for last week
  } else if (daysDiff > 7 && daysDiff <= 30) {
    groupBy = 2; // Every 2 days for last 30 days
  } else if (daysDiff > 30) {
    groupBy = 7; // Weekly for custom longer ranges
  }

  const revenueData = {};
  orders.forEach((order) => {
    if (order.paid) {
      const date = new Date(order.createdAt);
      let key;
      if (groupBy === 1 && daysDiff === 1) {
        // Hourly for 'today'
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}T${String(
          date.getHours()
        ).padStart(2, "0")}:00:00`;
      } else {
        // Daily or grouped
        key = date.toISOString().split("T")[0];
      }
      if (!revenueData[key]) {
        revenueData[key] = { amount: 0, orders: 0 };
      }
      const orderTotal = calculateOrderTotal(order);
      revenueData[key].amount += orderTotal;
      revenueData[key].orders += 1;
    }
  });

  const groupedRevenue = Object.entries(revenueData).map(([date, data]) => ({
    date,
    amount: data.amount,
    orders: data.orders,
  }));

  groupedRevenue.sort((a, b) => new Date(a.date) - new Date(b.date));

  return groupedRevenue;
}

function prepareHourlyData(orders) {
  const ordersByHour = Array(24).fill(0);
  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const norwegianHour = (date.getUTCHours() + 1) % 24; // Adjust for Norwegian time (UTC+1)
    ordersByHour[norwegianHour] += 1;
  });
  return ordersByHour.map((count, hour) => ({ hour, count }));
}

function calculateTopCustomers(orders) {
  const customerSales = {};
  orders.forEach((order) => {
    if (!order.userEmail) return;
    const email = order.userEmail;
    if (!customerSales[email]) {
      customerSales[email] = { email, totalSpent: 0, orders: 0 };
    }
    customerSales[email].totalSpent += calculateOrderTotal(order);
    customerSales[email].orders += 1;
  });
  return Object.values(customerSales).sort(
    (a, b) => b.totalSpent - a.totalSpent
  );
}
