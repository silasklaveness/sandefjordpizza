import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { Order } from "@/app/models/Order";
import { authOptions, isAdmin } from "@/app/utils/authOptions";

export async function GET(req) {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(process.env.MONGO_URL);

    // Parse query parameters from the request URL
    const url = new URL(req.url, `http://${req.headers.host}`);
    const _id = url.searchParams.get("_id");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    // Initialize filter object
    let filter = {};

    // Apply filter based on order ID if provided
    if (_id) {
      filter._id = _id;

      // If only an order ID is provided, allow access to the specific order without session authentication
      const order = await Order.findById(_id);

      // Return the order if found
      if (order) {
        return new Response(JSON.stringify([order]), { status: 200 });
      } else {
        return new Response(JSON.stringify({ message: "Order not found" }), {
          status: 404,
        });
      }
    }

    // Get the session information
    const session = await getServerSession(authOptions);

    // If no session is found and no order ID is provided, return unauthorized
    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    // Get user email from the session
    const userEmail = session.user?.email;

    // Check if the current user is an admin
    const admin = await isAdmin(session);

    // Apply date range filter if startDate or endDate is provided
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Set end time to the end of the day
        filter.createdAt.$lte = end;
      }
    }

    // If the user is not an admin, restrict the query to their own orders
    if (!admin && userEmail) {
      filter.userEmail = userEmail;
    } else if (!admin) {
      // If not admin and no userEmail, return unauthorized
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    // Fetch orders based on the filter
    const orders = await Order.find(filter);

    // Return the orders in the response
    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    console.error("Error fetching orders: ", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
