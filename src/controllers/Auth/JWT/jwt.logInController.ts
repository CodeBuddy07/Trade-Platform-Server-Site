import { Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TradesPerson } from "../../../models/tradePerson";
import catchAsync from "../../../utils/catchAsync";
import { createAppError } from "../../../middlewares/error";
import { CustomRequest } from "../JWT/jwt.roleVerifyController";
import { Admin } from "../../../models/admin";
import { Customer } from "../../../models/customer";


export const Login = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { email, password, remember } = req.body;


    const user = await TradesPerson.findOne({ email }) || await Admin.findOne({ email }) || await Customer.findOne({ email });

    if (!user) {
        return next(createAppError("Invalid credentials", 400));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return next(createAppError("Invalid credentials", 400)); 
    }

    // If rememberMe is true, extend JWT expiry to a longer duration
    const tokenExpiry = remember ? "7d" : "1h";
    
    const token = jwt.sign({ id: user._id , role: user.role}, process.env.JWT_SECRET as string, {
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
    });
});
