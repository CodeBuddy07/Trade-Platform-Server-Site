import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TradesPerson } from "../../../models/tradePerson";
import catchAsync from "../../../utils/catchAsync";
import { uploadImage } from "../../../config/cloudinary";
import { createAppError } from "../../../middlewares/error";


export const registerTradesPerson = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, email, password, phoneNumber, trade, serviceArea, verified } = req.body;
    let profilePhoto = null;

    if (req.file) {
      try {
        profilePhoto = await  await uploadImage(req.file);
      } catch (error) {
        return next(createAppError("Image upload failed", 500));
      }
    }


    const existingUser = await TradesPerson.findOne({ email });
    if (existingUser) {
      return next(createAppError("Email already exists!", 400));
    }

    const existingPhoneNumber = await TradesPerson.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      return next(createAppError("Phone number already exists!", 400));
    }


    const hashedPassword = await bcrypt.hash(password, 12);


    const newTradesPerson = await TradesPerson.create({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      trade,
      serviceArea,
      verified,
      profilePhoto,
    });

    const token = jwt.sign(
      { id: newTradesPerson._id },
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
      tradesPerson: {
        id: newTradesPerson._id,
        fullName: newTradesPerson.fullName,
        email: newTradesPerson.email,
        phoneNumber: newTradesPerson.phoneNumber,
        profilePhoto: newTradesPerson.profilePhoto,
      },
    });
  }
);
