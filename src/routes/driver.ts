import express from "express";
import { withSignIn } from "../middlewares/withSignIn";
import {
  deleteProfile,
  editProfile,
  getProfile,
  registerDriver,
} from "../controllers/drivers/driver";

export const router = express.Router();

router.post("/register-driver", withSignIn, registerDriver);
router.get("/driver-profile/:id", withSignIn, getProfile);
router.delete("/delete-profile/:id", withSignIn, deleteProfile);
router.put("/edit-profile/:id", withSignIn, editProfile);
