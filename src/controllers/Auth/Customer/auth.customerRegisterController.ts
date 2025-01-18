import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Customer } from "../../../models/customer";
import catchAsync from "../../../utils/catchAsync";
import { createAppError } from "../../../middlewares/error";
import { uploadImage } from "../../../config/cloudinary";



export const registerCustomer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      fullName,
      email,
      password,
      phoneNumber,
      serviceArea,
      preferredTrades,
    } = req.body;
    let profilePhoto = null;

    if (req.file) {
      try {
        profilePhoto =  await uploadImage(req.file);
      } catch (error) {
        return next(createAppError("Image upload failed", 500));
      }
    }


    const existingUser = await Customer.findOne({ email });
    if (existingUser) {
      return next(createAppError("Email already exists!", 400));
    }

    const existingPhoneNumber = await Customer.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      return next(createAppError("Phone number already exists!", 400));
    }


    const hashedPassword = await bcrypt.hash(password, 12);


    const newCustomer = await Customer.create({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      serviceArea,
      preferredTrades,
      profilePhoto,
    });


    const token = jwt.sign(
      { id: newCustomer._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    const cookieOptions = {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const, 
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.status(201).cookie("token", token, cookieOptions).json({
      message: "Registration successful, please log in!",
      token,
      customer: {
        id: newCustomer._id,
        fullName: newCustomer.fullName,
        email: newCustomer.email,
        phoneNumber: newCustomer.phoneNumber,
        profilePhoto: newCustomer.profilePhoto,
      },
    });
  }
);
