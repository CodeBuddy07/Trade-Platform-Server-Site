import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { createAppError } from "../../middlewares/error";
import { Trade } from "../../models/trades";
import { uploadImage } from "../../config/cloudinary";

export const addTrade = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description , skills } = req.body;
    const { tradeImage } = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    if (!name) {
      return next(createAppError("Trade name is required!", 400));
    }

    let tradeImageURL = null;

    if (tradeImage) {
      try {
       tradeImageURL = await uploadImage(tradeImage[0]);
      } catch (error) {
        return next(createAppError("Profile Image upload failed", 500));
      }
    }

    const trade = await Trade.create({ name, tradeImage:tradeImageURL, description, skills: skills.split(",").map((skill: string) => skill.trim()) });

    console.log(skills, typeof skills);

    res.status(201).json({
      success: true,
      message: "Trade Added Successfully!",
      // data: { trade },
    });
  }
);

// Delete a trade
