import { model, Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  fullName: string;
  email: string;
  password: string;
  preferredTrades?: Schema.Types.ObjectId[]; // Optional preferences for trades
  serviceArea: Schema.Types.ObjectId; // Reference to the ServiceArea
  phoneNumber: string;
  profilePhoto?: string;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    fullName: {
      type: String,
      required: [true, "Name is required!"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long."],
      maxlength: [50, "Name cannot exceed 50 characters."],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address."],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minlength: [8, "Password must be at least 8 characters long."],
    },
    preferredTrades: [
      {
        type: Schema.Types.ObjectId,
        ref: "Trade",
        validate: {
          validator: Array.isArray,
          message: "Preferred trades must be an array of trade references.",
        },
      },
    ],
    serviceArea: {
      type: Schema.Types.ObjectId,
      ref: "ServiceArea",
      required: [true, "Service area is required!"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required!"],
      unique: true,
      match: [/^\+?[1-9]\d{1,14}$/, "Please provide a valid phone number."],
    },
    profilePhoto: {
      type: String,
      validate: {
        validator: (value: string) =>
          value.startsWith("http://") || value.startsWith("https://"),
        message: "Profile photo must be a valid URL.",
      },
    },
  },
  { timestamps: true }
);

export const Customer = model<ICustomer>("Customer", CustomerSchema);