import mongoose, { Schema, Document, model } from "mongoose";

export interface ITrade extends Document {
  name: string;
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
    }
  },
  { timestamps: true }
);

export const Trade = model<ITrade>("Trade", TradeSchema);
