import express from "express";
import { withSignIn } from "../middlewares/withSignIn";
import {
  registerTrailer,
  getProfile,
  deleteProfile,
  editProfile,
} from "../controllers/trailers/trailer";

export const router = express.Router();

router.post("/register-trailer", withSignIn, registerTrailer);
router.get("/trailer-profile/:id", withSignIn, getProfile);
router.delete("/delete-profile/:id", withSignIn, deleteProfile);
router.put("/edit-profile/:id", withSignIn, editProfile);
