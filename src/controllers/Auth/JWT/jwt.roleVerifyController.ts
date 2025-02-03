import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { Admin } from "../../../models/admin";
import { Customer } from "../../../models/customer";
import { TradesPerson } from "../../../models/tradePerson";


export interface CustomRequest extends Request {
    user?: any;
  }

export const jwtVarify = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction)=> {
  
    try {
      const id = req.user.id
      const user = await Customer.findById(id).select("_id firstName lastName email phone profileImage trade").populate("trade") || await TradesPerson.findById(id).select("_id firstName lastName email phone profileImage trade").populate("trade")  || await Admin.findById(id).select("_id firstName lastName email phone profileImage trade").populate("trade");
      res.json({
        success: true,
        message: 'User Varified.',
        role: req.user.role,
        user: user
      });
      
    } catch (err) {
      next(err);
    }
  });