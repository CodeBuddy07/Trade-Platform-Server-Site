import { NextFunction, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { TradesPerson } from "../../models/tradePerson";
import { CustomRequest } from "../Auth/JWT/jwt.roleVerifyController";
import { createAppError } from "../../middlewares/error";
import { uploadImage, deleteImage } from "../../config/cloudinary";

export const updateProfile = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const tradePersonID = req.user.id;
    const {
      firstName,
      lastName,
      email,
      phone,
      trade,
      companyName,
      bio,
      registrationNumber,
      experience,
      postcode,
      businessType,
      employeeCount,
      companyWebsite,
      profileImagePublicID,
      insuranceImagePublicID,
      licenseImagePublicID,
      homeAddress1,
      homeAddress2,
      homeTown,
      homePostCode,
      homeCountry,
      businessAddressLine1,
      businessAddressLine2,
      businessTown,
      businessCountry,
      businessPostCode,
    } = req.body;

    // Check if req.files exists and destructure the files safely
    const profileImage =
      (req.files &&
        (req.files as { [fieldname: string]: Express.Multer.File[] })
          .profileImage) ||
      [];
    const insuranceImage =
      (req.files &&
        (req.files as { [fieldname: string]: Express.Multer.File[] })
          .insuranceImage) ||
      [];
    const licenseImage =
      (req.files &&
        (req.files as { [fieldname: string]: Express.Multer.File[] })
          .licenseImage) ||
      [];
      
    // const jobImage = (req.files && (req.files as { [fieldname: string]: Express.Multer.File[] }).jobImage) || [];

    let profileImageURL = null;
    let insuranceImageURL = null;
    let licenseImageURL = null;
    // let jobImageURL = null;

    // console.log(req.body);

    try {
      // Handle Profile Image
      if (profileImage && profileImage.length > 0) {
        if (profileImagePublicID) {
          // Delete the old profile image if a new one is provided
          await deleteImage(profileImagePublicID);
        }
        profileImageURL = await uploadImage(profileImage[0]);
      }

      // if (jobImage && jobImage.length > 0) {
      //     jobImageURL = await uploadImage(jobImage[0]);
      // }

      // Handle Insurance Image
      if (insuranceImage && insuranceImage.length > 0) {
        if (insuranceImagePublicID) {
          // Delete the old insurance image if a new one is provided
          await deleteImage(insuranceImagePublicID);
        }
        insuranceImageURL = await uploadImage(insuranceImage[0]);
      }

      // Handle License Image
      if (licenseImage && licenseImage.length > 0) {
        if (licenseImagePublicID) {
          // Delete the old license image if a new one is provided
          await deleteImage(licenseImagePublicID);
        }
        licenseImageURL = await uploadImage(licenseImage[0]);
      }

      // Update TradePerson's data
      const updatedTradePerson = await TradesPerson.findByIdAndUpdate(
        tradePersonID,
        {
          firstName: firstName || undefined,
          bio: bio || undefined,
          lastName: lastName || undefined,
          email: email || undefined,
          phone: phone || undefined,
          trade: trade || undefined,
          companyName: companyName || undefined,
          registrationNumber: registrationNumber || undefined,
          experience: experience || undefined,
          postcode: postcode || undefined,
          businessType: businessType || undefined,
          employeeCount: employeeCount || undefined,
          companyWebsite: companyWebsite || undefined,
          profileImage: profileImageURL || undefined,
          insuranceImage: insuranceImageURL || undefined,
          licenseImage: licenseImageURL || undefined,
    // Ensure homeAddress updates only when new values exist
    ...(homeAddress1 || homeAddress2 || homeTown || homePostCode || homeCountry
      ? {
          homeAddress: {
            addressLine1: homeAddress1 || undefined,
            addressLine2: homeAddress2 || undefined,
            town: homeTown || undefined,
            postCode: homePostCode || undefined,
            country: homeCountry || undefined,
          },
        }
      : {}),

    // Ensure businessAddress updates only when new values exist
    ...(businessAddressLine1 || businessAddressLine2 || businessTown || businessPostCode || businessCountry
      ? {
          businessAddress: {
            addressLine1: businessAddressLine1 || undefined,
            addressLine2: businessAddressLine2 || undefined,
            town: businessTown || undefined,
            postCode: businessPostCode || undefined,
            country: businessCountry || undefined,
          },
        }
      : {}),
          // jobGalleries: licenseImageURL || undefined
        },
        { new: true } // Return the updated document
      );

      if (!updatedTradePerson) {
        return next(createAppError("Trade person not found", 404));
      }

      // Respond with the updated trade person details
      res.status(200).json({
        success: true,
        message: "Profile updated successfully!",
      });
    } catch (error) {
      return next(createAppError("Profile update failed", 500));
    }
  }
);
