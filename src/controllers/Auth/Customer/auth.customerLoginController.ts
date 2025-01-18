import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Customer } from "../../../models/customer";
import catchAsync from "../../../utils/catchAsync";
import { createAppError } from "../../../middlewares/error";


export const loginCustomer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, rememberMe } = req.body;


    const customer = await Customer.findOne({ email });
    if (!customer) {
      return next(createAppError("Invalid credentials", 400));
    }


    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return next(createAppError("Invalid credentials", 400));
    }

    // If rememberMe is true, we extend the JWT expiry to a longer duration
    const tokenExpiry = rememberMe ? "7d" : "1h";


    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET as string, {
      expiresIn: tokenExpiry,
    });

    const cookieOptions = {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const, 
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.status(200).cookie("token", token, cookieOptions).json({
      message: "Login successful",
      token,
      customer: {
        id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        profilePhoto: customer.profilePhoto,
      },
    });
  }
);
