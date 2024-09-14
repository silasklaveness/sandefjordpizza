// /app/api/categories/route.js

import mongoose from "mongoose";
import { Category } from "../../models/Category"; // Adjust the path as needed
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    // Fetch top-level categories (parent: null) and populate subcategories
    const categories = await Category.find({ parent: null })
      .populate({
        path: "subcategories",
        populate: {
          path: "subcategories", // Adjust for deeper nesting if needed
        },
      })
      .lean();

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const { name, parent } = await req.json();

    const categoryDoc = await Category.create({
      name,
      parent: parent === "none" ? null : parent,
    });

    return NextResponse.json(categoryDoc, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const { _id, name, parent } = await req.json();

    await Category.updateOne(
      { _id },
      {
        name,
        parent: parent === "none" ? null : parent,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");

    // Check if the category has subcategories
    const subcategories = await Category.find({ parent: _id });
    if (subcategories.length > 0) {
      // Prevent deletion if subcategories exist
      return NextResponse.json(
        { error: "Cannot delete category with subcategories" },
        { status: 400 }
      );
    }

    await Category.deleteOne({ _id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
