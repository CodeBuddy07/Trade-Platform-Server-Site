import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TradesPerson } from "../../../models/tradePerson";
import catchAsync from "../../../utils/catchAsync";
import { uploadImage } from "../../../config/cloudinary";
import { createAppError } from "../../../middlewares/error";


export const registerTradesPerson = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password, phone, trade, companyName, registrationNumber, experience, postcode} = req.body;

    const {profileImage} = req.files as { [fieldname: string]: Express.Multer.File[] };
    const {insuranceImage} = req.files as { [fieldname: string]: Express.Multer.File[] };
    const {licenseImage} = req.files as { [fieldname: string]: Express.Multer.File[] };

   

    let profileImageURL = null;
    let insuranceImageURL = null;
    let licenseImageURL = null;

    if (profileImage) {

      try {
        profileImageURL = await uploadImage(profileImage[0]);
      } catch (error) {
        return next(createAppError("Profile Image upload failed", 500));
      }
    }

    if (insuranceImage) {
      try {
        insuranceImageURL = await uploadImage(insuranceImage[0]);
      } catch (error) {
        return next(createAppError("Insurance Image upload failed", 500));
      }
    }

    if (licenseImage) {
      try {
        licenseImageURL = await uploadImage(licenseImage[0]);
      } catch (error) {
        return next(createAppError("License Image upload failed", 500));
      }
    }

    const existingUser = await TradesPerson.findOne({ email });
    if (existingUser) {
      return next(createAppError("Email already exists!", 400));
    }

    const existingPhoneNumber = await TradesPerson.findOne({ phone });
    if (existingPhoneNumber) {
      return next(createAppError("Phone number already exists!", 400));
    }


    const hashedPassword = await bcrypt.hash(password, 12);


    const newTradesPerson = await TradesPerson.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      trade,
      postCode:postcode,
      experience,
      company:{
        name: companyName,
        registrationNumber,
        proofOfInsurance: insuranceImageURL
      },
      verified: false,
      certifications: licenseImageURL,
      profileImage: profileImageURL,
      role: "tradePerson"
    });

    const token = jwt.sign(
      { id: newTradesPerson._id, role: "tradePerson" },
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
      token,
      tradesPerson: {
        id: newTradesPerson._id,
        fullName: newTradesPerson.firstName + " " + newTradesPerson.lastName,
        email: newTradesPerson.email,
        phoneNumber: newTradesPerson.phone,
        profileImage: newTradesPerson.profileImage,
      },
    });
  }
);
