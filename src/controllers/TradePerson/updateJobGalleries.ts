import { NextFunction, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { CustomRequest } from "../Auth/JWT/jwt.roleVerifyController";
import { TradesPerson } from "../../models/tradePerson";
import { createAppError } from "../../middlewares/error";
import { deleteImage, uploadImage } from "../../config/cloudinary";


// ✅ Get all job images
export const getJobImages = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const tradePersonID = req.user.id;
    const tradePerson = await TradesPerson.findById(tradePersonID);

    if (!tradePerson) {
      return next(createAppError("Trade person not found", 404));
    }

    res.status(200).json({
      success: true,
      jobGalleries: tradePerson.jobGalleries || [],
    });
  }
);

// ✅ Add new job image
export const addJobImage = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const tradePersonID = req.user.id;

    // Extract jobImage from request files
    const jobImage =
      (req.files &&
        (req.files as { [fieldname: string]: Express.Multer.File[] }).jobImage) ||
      [];

    if (!jobImage.length) {
      return next(createAppError("No image uploaded", 400));
    }

    try {
      // Upload the image to Cloudinary
      const jobImageURL = await uploadImage(jobImage[0]);

      // Update the database by adding the new image
      const updatedTradePerson = await TradesPerson.findByIdAndUpdate(
        tradePersonID,
        { $push: { jobGalleries: jobImageURL } }, // Append to the array
        { new: true }
      );

      if (!updatedTradePerson) {
        return next(createAppError("Trade person not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "Image added successfully!",
        jobGalleries: updatedTradePerson.jobGalleries,
      });
    } catch (error ) {
      const errorMessage = (error instanceof Error) ? error.message : "Image upload failed";
      return next(createAppError(errorMessage, 500));
    }
  }
);

// ✅ Delete job image
export const deleteJobImage = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const tradePersonID = req.user.id;
    const { imageUrl } = req.body; // Expecting image URL in request body

    if (!imageUrl) {
      return next(createAppError("Image URL is required", 400));
    }

    try {
      // Find the trade person
      const tradePerson = await TradesPerson.findById(tradePersonID);
      if (!tradePerson) {
        return next(createAppError("Trade person not found", 404));
      }

      // Check if the image exists in jobGalleries
    //   console.log(tradePerson.jobGalleries.some((obj)=> obj.publicId === imageUrl.publicId));
      if (!tradePerson.jobGalleries || !tradePerson.jobGalleries.some((obj)=> obj.publicId === imageUrl.publicId)) {
        return next(createAppError("Image not found in jobGalleries", 404));
      }

      // Remove the image from Cloudinary
      await deleteImage(imageUrl.publicId);

      // Update the database by removing the image from jobGalleries
      const updatedTradePerson = await TradesPerson.findByIdAndUpdate(
        tradePersonID,
        { $pull: { jobGalleries: {publicId: imageUrl.publicId} } }, // Remove from the array
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Image deleted successfully!",
        jobGalleries: updatedTradePerson?.jobGalleries || [],
      });
    } catch (error) {
      return next(createAppError("Image deletion failed", 500));
    }
  }
);
