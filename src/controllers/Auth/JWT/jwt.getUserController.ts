import { NextFunction, Response } from "express";
import { CustomRequest } from "./jwt.roleVerifyController";
import catchAsync from "../../../utils/catchAsync";
import { Customer } from "../../../models/customer";
import { Admin } from "../../../models/admin";
import { TradesPerson } from "../../../models/tradePerson";

export const getUser = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const user = await Customer.findById(id).select("_id firstName lastName email phone profileImage trade").populate("trade") || await TradesPerson.findById(id).select("_id firstName lastName email phone profileImage trade").populate("trade")  || await Admin.findById(id).select("_id firstName lastName email phone profileImage trade").populate("trade");
    console.log(user);
})