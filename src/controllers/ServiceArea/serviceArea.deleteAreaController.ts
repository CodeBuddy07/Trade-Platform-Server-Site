import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import { ServiceArea } from "../../models/serviceArea";
import { createAppError } from "../../middlewares/error";

export const deleteServiceArea = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
  
    const serviceArea = await ServiceArea.findByIdAndDelete(id);
  
    if (!serviceArea) {
      return next(createAppError("Service Area not found!", 404));
    }
  
    res.status(204).json({
      status: "success",
      data: null,
    });
  });