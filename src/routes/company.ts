import express from "express";
import {
  deleteProfile,
  editProfile,
  fetchCompanies,
  getCompanyProperties,
  getProfile,
  registerCompany,
} from "../controllers/company";
import { withSignIn } from "../middlewares/withSignIn";

export const router = express.Router();

router.post("/register-company", registerCompany);
router.get("/fetch-companies", fetchCompanies);
router.get("/company-profile/:id", getProfile);
router.delete("/delete-profile/:id", deleteProfile);
router.put("/edit-profile/:id", editProfile);
router.get("/:id/fetch-properties", withSignIn, getCompanyProperties);
