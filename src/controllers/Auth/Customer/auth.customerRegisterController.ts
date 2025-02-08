import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import catchAsync from "../../../utils/catchAsync";
import { createAppError } from "../../../middlewares/error";
import { uploadImage } from "../../../config/cloudinary";
import { Customer } from "../../../models/customer";
import { TradesPerson } from "../../../models/tradePerson";
import { Admin } from "../../../models/admin";



export const registerCustomer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, phone, email, postCode, password } = req.body;

    const {profileImage} = req.files as { [fieldname: string]: Express.Multer.File[] };
    let profileImageURL = null;

    const existingUser =  await Customer.findOne({ email }) || await TradesPerson.findOne({ email })  || await Admin.findOne({ email });

    if (existingUser) {
      return next(createAppError("Email already exists!", 400));
    }

    const existingPhoneNumber = await TradesPerson.findOne({ phone }) || await Admin.findOne({ phone }) || await Customer.findOne({ phone });
        
    if (existingPhoneNumber) {
      return next(createAppError("Phone number already exists!", 400));
    }

    try {
      profileImageURL = await uploadImage(profileImage[0]);
    } catch (error) {
      return next(createAppError("Profile Image upload failed", 500));
    }

    // console.log("dsas", profileImage);


    const hashedPassword = await bcrypt.hash(password, 12);

    const newCustomer = await Customer.create({
      firstName,
      lastName,
      phone,
      email,
      postCode,
      profileImage: profileImageURL,
      password: hashedPassword,
      role: "customer"
    });


    const token = jwt.sign(
      { id: newCustomer._id, role: "customer" },
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
      success: true,
      message: "Registration successful, please log in!",
    });
  }
);
