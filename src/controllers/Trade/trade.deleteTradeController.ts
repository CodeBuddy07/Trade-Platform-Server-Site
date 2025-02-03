import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { createAppError } from "../../middlewares/error";
import { Trade } from "../../models/trades";


  export const deleteTrade = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
  
    const trade = await Trade.findByIdAndDelete(id);
  
    if (!trade) {
      return next(createAppError("Trade not found!", 404));
    }
  
    res.status(200).json({
      status: "success",
      data: null,
    });
  });