import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";

export const withSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.get("Authorization");

    const tokenData = jsonwebtoken.verify(
      token!,
      process.env.SECRET_TOKEN!
    ) as {
      adminId: string;
    };
    (req as any).adminId = tokenData.adminId;
    next();
  } catch (err) {
    res.status(422).json({
      message: "middlewares error: not signed in",
    });
  }
};
