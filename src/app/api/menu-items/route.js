import MenyItem from "@/components/meny/MenyItem";
import { MenuItem } from "../../models/MenuItem";
import mongoose from "mongoose";
export async function POST(req) {
  await mongoose.connect(process.env.MONGO_URL);
  const data = await req.json();

  // Convert category and subcategory to ObjectId using the new constructor
  if (data.category) {
    data.category = new mongoose.Types.ObjectId(data.category); // Use the new constructor
  }
  if (data.subcategory) {
    data.subcategory = new mongoose.Types.ObjectId(data.subcategory); // Use the new constructor
  }

  try {
    const menuItemDoc = await MenuItem.create(data);
    return new Response(JSON.stringify(menuItemDoc), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return new Response(JSON.stringify({ error: "Error creating menu item" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(req) {
  mongoose.connect(process.env.MONGO_URL);
  const { _id, ...data } = await req.json();
  await MenuItem.findByIdAndUpdate(_id, data);
  return Response.json(true);
}

export async function GET() {
  mongoose.connect(process.env.MONGO_URL);
  return Response.json(await MenuItem.find());
}

export async function DELETE(req) {
  mongoose.connect(process.env.MONGO_URL);
  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");
  await MenuItem.deleteOne({ _id });
  return Response.json(true);
}
