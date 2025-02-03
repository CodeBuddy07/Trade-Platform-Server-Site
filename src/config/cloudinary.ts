import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";


dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

export default cloudinary;

export const uploadImage = async (file: Express.Multer.File) => {
  if (!file) throw new Error("Missing required parameter - file");

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "TradePeople_(Client_Work)" }, 
      (error, result) => {
        if (error) return reject(error);
        resolve({
          publicId: result?.public_id,
          url: result?.secure_url
        });
      }
    ).end(file.buffer); 
  });
};


export const deleteImage = async (publicId: string) => {
try {
  const result = await cloudinary.uploader.destroy(publicId);
  if (result.result === "ok") {
    return "Image deleted successfully";
  } else {
    throw new Error("Failed to delete image");
  }
} catch (error) {
  console.error(error);
  throw new Error("Image deletion failed");
}
};




