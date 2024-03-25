import mongoose, { Schema } from "mongoose";

const driverSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },

  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
  },

  firstName: {
    type: String,
  },

  lastName: {
    type: String,
  },

  phoneNumber: {
    type: String,
  },

  licenseNum: {
    type: String,
  },

  licenseType: {
    type: String,
  },

  typeValidU: {
    type: String,
  },

  codeNum: {
    type: String,
  },

  codeNumValidU: {
    type: String,
  },

  driverCardNum: {
    type: String,
  },

  driverCardNumValidU: {
    type: String,
  },
});

export const Driver =
  mongoose.models?.Driver || mongoose.model("Driver", driverSchema);
