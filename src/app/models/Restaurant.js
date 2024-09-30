import mongoose, { model, models, Schema } from "mongoose";

const OpeningTimeSchema = new Schema({
  open: { type: String, required: true },
  close: { type: String, required: true },
});

const SpecialOccasionSchema = new Schema({
  date: { type: String, required: true },
  open: { type: String },
  close: { type: String },
  isClosed: { type: Boolean, default: false },
});

const RestaurantSchema = new Schema(
  {
    name: { type: String, required: true },
    openingTimes: {
      type: Map,
      of: OpeningTimeSchema,
      default: {},
    },
    specialOccasions: {
      type: [SpecialOccasionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const Restaurant =
  models?.Restaurant || model("Restaurant", RestaurantSchema);
