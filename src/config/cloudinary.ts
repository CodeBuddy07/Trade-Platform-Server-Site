import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import dotenv from "dotenv";


dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

export default cloudinary;

export const uploadImage = async (file: Express.Multer.File) => {
  if (!file) {
    console.error("❌ Error: Missing required parameter - file.");
    throw new Error("Missing required parameter - file");
  }

  return new Promise<{ publicId: string; url: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "TradePeople_(Client_Work)" },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          console.error("❌ Cloudinary Upload Error:", error);
          return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        }
        
        if (!result) {
          console.error("❌ Cloudinary response is undefined or null.");
          return reject(new Error("Cloudinary upload failed: No response received."));
        }

        console.log("✅ Cloudinary Upload Successful:", {
          publicId: result.public_id,
          url: result.secure_url,
        });

        resolve({
          publicId: result.public_id,
          url: result.secure_url,
        });
      }
    );

    uploadStream.end(file.buffer);
  });
};

export const deleteImage = async (publicId: string) => {
  if (!publicId) throw new Error("Missing required parameter - publicId");

  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result?.result === "ok") {
      return { success: true, message: "Image deleted successfully" };
    } else {
      console.error(`Cloudinary deletion failed for Public ID: ${publicId}`, result);
      throw new Error("Failed to delete image from Cloudinary.");
    }
  } catch (error: any) {
    console.error("Error deleting image from Cloudinary:", {
      publicId,
      message: error.message,
      stack: error.stack,
    });

    throw new Error(`Image deletion failed: ${error.message || "Unknown error"}`);
  }
};




