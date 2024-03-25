import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },

  email: {
    type: String,
  },

  password: {
    type: String,
  },

  emailVerified: {
    type: Boolean,
    default: false,
  },

  emailVerificationToken: {
    type: String,
  },
});

export const Admin =
  mongoose.models?.Admin || mongoose.model("Admin", adminSchema);
