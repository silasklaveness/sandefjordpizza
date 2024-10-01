// app/api/restaurant/route.js

import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { Restaurant } from "@/app/models/Restaurant";
import { authOptions, isAdmin } from "@/app/utils/authOptions";

export async function GET(req) {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const session = await getServerSession(authOptions);

    const restaurant = await Restaurant.findOne();

    if (!restaurant) {
      return new Response(JSON.stringify({ message: "Restaurant not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(restaurant), { status: 200 });
  } catch (error) {
    console.error("Error fetching restaurant data: ", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const admin = await isAdmin(session);

    if (!admin) {
      return new Response(
        JSON.stringify({ message: "Forbidden: Admins only" }),
        {
          status: 403,
        }
      );
    }

    const restaurantData = await req.json();

    if (!restaurantData || !restaurantData.name) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        {
          status: 400,
        }
      );
    }

    // Initialize openingTimes if it's empty or not provided
    if (
      !restaurantData.openingTimes ||
      Object.keys(restaurantData.openingTimes).length === 0
    ) {
      restaurantData.openingTimes = {
        Monday: { open: "12:00", close: "22:00" },
        Tuesday: { open: "12:00", close: "22:00" },
        Wednesday: { open: "12:00", close: "22:00" },
        Thursday: { open: "12:00", close: "22:00" },
        Friday: { open: "12:00", close: "22:00" },
        Saturday: { open: "12:00", close: "22:00" },
        Sunday: { open: "12:00", close: "22:00" },
      };
    }

    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      {},
      restaurantData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return new Response(
      JSON.stringify({
        message: "Restaurant updated successfully",
        restaurant: updatedRestaurant,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating restaurant data: ", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
