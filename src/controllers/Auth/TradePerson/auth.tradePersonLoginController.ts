import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TradesPerson } from "../../../models/tradePerson";
import catchAsync from "../../../utils/catchAsync";
import { createAppError } from "../../../middlewares/error";


export const TradesPersonLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, rememberMe } = req.body;


    const user = await TradesPerson.findOne({ email });

    if (!user) {
        return next(createAppError("Invalid credentials", 400));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return next(createAppError("Invalid credentials", 400)); 
    }

    // If rememberMe is true, extend JWT expiry to a longer duration
    const tokenExpiry = rememberMe ? "7d" : "1h";
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
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
