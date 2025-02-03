import { Schema, model } from "mongoose";

export interface IAdmin extends Document {
  fullName: string;
  email: string;
  password: string;
  role: "superadmin" | "admin"; // Superadmin has all privileges
  profilePhoto?: string; // Optional profile picture
}

const AdminSchema = new Schema<IAdmin>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
    role: {
      type: String,
      enum: ["superadmin", "admin"],
      required: true,
      default: "admin",
    },
    profilePhoto: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Admin = model<IAdmin>("Admin", AdminSchema);
