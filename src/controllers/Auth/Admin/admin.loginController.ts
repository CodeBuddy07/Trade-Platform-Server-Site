import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../../../models/admin";
import catchAsync from "../../../utils/catchAsync";
import { createAppError } from "../../../middlewares/error";

export const adminLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createAppError("Email and password are required!", 400));
  }

  // Find the admin by email
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return next(createAppError("Invalid credentials!", 401));
  }

  // Compare passwords
  const isPasswordCorrect = await bcrypt.compare(password, admin.password);
  if (!isPasswordCorrect) {
    return next(createAppError("Invalid credentials!", 401));
  }

  // Generate a JWT token
  const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET as string, {
    expiresIn: "1d", // Adjust expiry as needed
  });

  // Store the token in an HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure flag in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  });

  res.status(200).json({
    message: "Login successful",
    data: {
      id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
    },
  });
});
