import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { getProfile } from "../controllers/TradePerson/getProfile";
import upload from "../config/multer";
import { updateProfile } from "../controllers/TradePerson/updateProfile";
import { addJobImage, deleteJobImage, getJobImages } from "../controllers/TradePerson/updateJobGalleries";

const router = express.Router();


router.get("/get-profile", verifyToken, getProfile);
router.get("/get-job-gallery", verifyToken, getJobImages);
router.post("/delete-job-image", verifyToken, deleteJobImage);
router.post(
    "/update-profile",verifyToken,
    upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "insuranceImage", maxCount: 1 },
    { name: "licenseImage", maxCount: 1 },
    // { name: "jobImage", maxCount: 1 },
  ]), updateProfile);

  router.post(
    "/update-profile/job-gallery",verifyToken,
    upload.fields([
      { name: "jobImage", maxCount: 1 }
  ]), addJobImage);


export default router;