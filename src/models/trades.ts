import mongoose, { Schema, Document, model } from "mongoose";

export interface ITrade extends Document {
  name: string;
  description: string;
  tradeImage: {
    publicId: string,
    url: string,
  };
  skills: string[];
}

const TradeSchema = new Schema<ITrade>(
  {
    name: {
      type: String,
      required: [true, "Trade name is required."],
      unique: true,
      trim: true,
      minlength: [3, "Trade name must be at least 3 characters long."],
      maxlength: [50, "Trade name cannot exceed 50 characters."],
    },
    tradeImage: {
      publicId: {
        type: String,
        required: [true, "Trade Image is required."],
        default: null, // Optional if the image is not required
      },
      url: {
        type: String,
        required: [true, "Trade Image is required."],
        default: null,
      },
    },
    description: {
      type: String,
      required: [true, "Trade description is required."],
      unique: true,
      trim: true,
      minlength: [3, "Trade name must be at least 3 characters long."],
      maxlength: [500, "Trade name cannot exceed 50 characters."],
    },
    skills: {
      type: [String],
      required: [true, "Skills are required."],
    }

  },
  { timestamps: true }
);

export const Trade = model<ITrade>("Trade", TradeSchema);
