import mongoose, { Schema } from "mongoose";

const companySchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },

  adminId: {
    type: Schema.Types.ObjectId,
    ref: "Admin",
  },

  company: {
    type: String,
  },

  firstName: {
    type: String,
  },

  lastName: {
    type: String,
  },

  email: {
    type: String,
  },

  phone: {
    type: String,
  },

  street: {
    type: String,
  },

  number: {
    type: String,
  },

  zip: {
    type: String,
  },

  city: {
    type: String,
  },

  licenseNum: {
    type: String,
  },
});

export const Company =
  mongoose.models?.Company || mongoose.model("Company", companySchema);
