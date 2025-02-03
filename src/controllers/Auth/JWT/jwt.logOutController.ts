import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";

export const logoutUser =  catchAsync(async (req: Request, res: Response, next: NextFunction)=> {
    try {
      // Clear the token from cookies
      res.clearCookie('token', {
        httpOnly: true,
        secure: true, // Ensure this matches your production environment settings
        sameSite: 'strict', // Prevent CSRF attacks
      });
  
      res.status(200).json({ success: true, message: 'Logged out successfully!' });
    } catch (error) {
      next(error)
    }
  });