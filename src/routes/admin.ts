import express from "express";
import { getProfile, signIn, signUp, verifyEmail } from "../controllers/admin";
import { withSignIn } from "../middlewares/withSignIn";

export const router = express.Router();

router.post("/sign-up-admin", signUp);
router.post("/sign-in-admin", signIn);
router.post("/verify-email", verifyEmail);
router.get("/get-profile", withSignIn, getProfile);
