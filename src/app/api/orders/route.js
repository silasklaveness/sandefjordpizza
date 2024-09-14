// /src/app/api/orders/route.js

import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { Order } from "@/app/models/Order";
import { authOptions, isAdmin } from "@/app/utils/authOptions";

export async function GET(req) {
  await mongoose.connect(process.env.MONGO_URL);

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const admin = await isAdmin(session);

  const url = new URL(req.url, `http://${req.headers.host}`);
  const _id = url.searchParams.get("_id");
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  let filter = {};

  if (_id) {
    filter._id = _id;
  }

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) {
      filter.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
  }

  if (!admin && userEmail) {
    filter.userEmail = userEmail;
  }

  const orders = await Order.find(filter);

  return new Response(JSON.stringify(orders), { status: 200 });
}
