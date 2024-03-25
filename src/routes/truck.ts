import express from "express";
import { withSignIn } from "../middlewares/withSignIn";
import {
  registerTruck,
  getProfile,
  deleteProfile,
  editProfile,
} from "../controllers/trucks/truck";

export const router = express.Router();

router.post("/register-truck", withSignIn, registerTruck);
router.get("/truck-profile/:id", withSignIn, getProfile);
router.delete("/delete-profile/:id", withSignIn, deleteProfile);
router.put("/edit-profile/:id", withSignIn, editProfile);
