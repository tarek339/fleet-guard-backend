import { Request, Response } from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Admin } from "../models/admin";
import { Error, mongooseErrorHandler } from "../types/interfaces";

export const signUp = async (req: Request, res: Response) => {
  try {
    const emailToken = crypto.randomBytes(32).toString("hex");

    const admin = new Admin({
      email: req.body.email,
      password: req.body.password,
      emailVerificationToken: emailToken,
    });

    await admin.save();

    const transport = nodemailer.createTransport({
      service: process.env.GOOGLE_SERVICE,
      auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PASSWORD,
      },
    });
    await transport.sendMail({
      from: process.env.GOOGLE_EMAIL,
      to: admin.email,
      subject: "Verify your E-Mail",
      html: `<p>Verify your E-Mail to use the App</p>
              <a href="http://localhost:5173/verify-email?token=${emailToken}">click here to verify</a>      
        `,
    });

    const token = jwt.sign(
      {
        adminId: admin._id,
      },
      process.env.SECRET_TOKEN!,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Admin created",
      admin: {
        _id: admin._id,
        email: admin.email,
        password: admin.email,
        emailVerified: admin.emailVerified,
      },
      token,
    });
  } catch (err) {
    res.status(422).json({
      message: mongooseErrorHandler(err as Error),
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findOne({
      emailVerificationToken: req.body.token,
    });
    if (!admin) {
      return res.status(422).json({
        message: "Invalid token!",
      });
    }
    admin.emailVerified = true;
    await admin.save();
    res.json(admin);
  } catch (err) {
    res.status(422).json({
      message: mongooseErrorHandler(err as Error),
    });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    const token = jwt.sign(
      {
        adminId: admin._id,
      },
      process.env.SECRET_TOKEN!,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      admin: {
        _id: admin._id,
        email: admin.email,
        emailVerified: admin.emailVerified,
      },
      token,
    });
  } catch (err) {
    res.status(422).json({
      message: mongooseErrorHandler(err as Error),
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findById((req as any).adminId).select(
      "-password"
    );
    res.json(admin);
  } catch (err) {
    res.status(401).json({
      message: "Log in to get profile",
    });
  }
};
