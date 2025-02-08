import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  postCode: string;
  profileImage: {
    url: string;
    publicId: string;
  };
  password: string;
  role: string;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name must not exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name must not exceed 50 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      match: [/^\d{10,15}$/, "Please enter a valid phone number"], // 10-15 digits
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    postCode: {
      type: String,
      required: [true, "Postcode is required"],
      trim: true,
    },
    profileImage: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      
    },
    role: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export const Customer = mongoose.model<ICustomer>("Customer", CustomerSchema);
 
