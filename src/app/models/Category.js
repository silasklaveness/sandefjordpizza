// models/Category.js

import mongoose, { model, models, Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  },
  { timestamps: true }
);

// Virtual field to populate subcategories
CategorySchema.virtual("subcategories", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
  justOne: false,
});

CategorySchema.set("toObject", { virtuals: true });
CategorySchema.set("toJSON", { virtuals: true });

export const Category = models.Category || model("Category", CategorySchema);
