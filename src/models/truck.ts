import mongoose, { Schema } from "mongoose";

const truckSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },

  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
  },

  indicator: {
    type: String,
  },

  brand: {
    type: String,
  },

  type: {
    type: String,
  },

  weight: {
    type: String,
  },

  nextHU: {
    type: String,
  },

  nextSP: {
    type: String,
  },
});

export const Truck =
  mongoose.models?.Truck || mongoose.model("Truck", truckSchema);
