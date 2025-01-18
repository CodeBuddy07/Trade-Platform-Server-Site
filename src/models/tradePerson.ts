import { model, Schema, Document } from "mongoose";

export interface ITradesPerson extends Document {
  fullName: string;
  email: string;
  password: string;
  trade: Schema.Types.ObjectId; // Reference to the Trade
  serviceArea: Schema.Types.ObjectId[]; // Multiple service areas
  phoneNumber: string;
  profilePhoto?: string;
  verified: boolean;
}

const TradesPersonSchema = new Schema<ITradesPerson>(
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
    trade: {
      type: Schema.Types.ObjectId,
      ref: "Trade",
      required: [true, "Trade is required!"],
    },
    serviceArea: [
      {
        type: Schema.Types.ObjectId,
        ref: "ServiceArea",
        validate: {
          validator: Array.isArray,
          message: "Service area must be an array of valid references.",
        },
      },
    ],
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
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const TradesPerson = model<ITradesPerson>(
  "TradesPerson",
  TradesPersonSchema
);
