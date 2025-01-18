import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { createAppError } from "../../middlewares/error";
import { Trade } from "../../models/trades";

export const addTrade = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
  
    if (!name) {
      return next(createAppError("Trade name is required!", 400));
    }
  
    const trade = await Trade.create({ name });
  
    res.status(201).json({
      status: "success",
      data: { trade },
    });
  });
  
  // Delete a trade