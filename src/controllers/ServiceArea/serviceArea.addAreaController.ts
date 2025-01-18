import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import { ServiceArea } from "../../models/serviceArea";
import { createAppError } from "../../middlewares/error";

export const addServiceArea = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  if (!name) {
    return next(createAppError("Service Area name is required!", 400));
  }

  const serviceArea = await ServiceArea.create({ name });

  res.status(201).json({
    status: "success",
    data: { serviceArea },
  });
});


