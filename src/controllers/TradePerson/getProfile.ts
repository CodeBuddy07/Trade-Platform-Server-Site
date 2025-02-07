import { NextFunction, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { TradesPerson } from "../../models/tradePerson";
import { CustomRequest } from "../Auth/JWT/jwt.roleVerifyController";
import { createAppError } from "../../middlewares/error";

export const getProfile = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const tradePerson = await TradesPerson.findById(req.user.id).populate("trade");
    if (!tradePerson){
        return next(createAppError("Trade Person not found",404));
    }
    res.status(200).json({success: true, message: "user fetched Successfully", tradePerson});
});