import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";


export interface CustomRequest extends Request {
    user?: any;
  }

export const jwtVarify = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction)=> {
  
    try {
      res.json({
        success: true,
        message: 'User Varified.',
        role: req.user.role,
      });
      
    } catch (err) {
      next(err);
    }
  });