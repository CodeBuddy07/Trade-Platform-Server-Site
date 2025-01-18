import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import { Trade } from "../../models/trades";


export const getAllTrades = catchAsync(async (req: Request, res: Response) => {
  const trades = await Trade.find();
  res.status(200).json({
    status: "success",
    results: trades.length,
    data: { trades },
  });
});



