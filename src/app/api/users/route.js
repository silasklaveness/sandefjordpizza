import { User } from "@/app/models/User";
import mongoose from "mongoose";
import { isAdmin } from "@/app/utils/authOptions"; // Make sure to use the correct path

export async function GET(req) {
  // Check if the current user is an admin
  const isAdminUser = await isAdmin();

  if (!isAdminUser) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // Connect to the database if not connected already
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    // Fetch the users only if admin check passes
    const users = await User.find();

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
