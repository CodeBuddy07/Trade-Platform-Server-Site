import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import { ServiceArea } from "../../models/serviceArea";



export const getAllServiceAreas = catchAsync(async (req: Request, res: Response) => {
  const serviceAreas = await ServiceArea.find();
  res.status(200).json({
    status: "success",
    results: serviceAreas.length,
    data: { serviceAreas },
  });
});
