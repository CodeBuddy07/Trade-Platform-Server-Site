import mongoose, { Schema, Document, model } from "mongoose";

export interface IJob extends Document {
  title: string;
  description: string;
  trade: Schema.Types.ObjectId;
  serviceArea: Schema.Types.ObjectId;
  budget: number;
  deadline?: Date;
  images: string[];
  createdBy: Schema.Types.ObjectId;
  customer?: Schema.Types.ObjectId;
  status: "open" | "in-progress" | "completed" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, "Job title is required."],
      trim: true,
      minlength: [5, "Job title must be at least 5 characters long."],
      maxlength: [100, "Job title cannot exceed 100 characters."],
    },
    description: {
      type: String,
      required: [true, "Job description is required."],
      trim: true,
      minlength: [20, "Job description must be at least 20 characters long."],
      maxlength: [1000, "Job description cannot exceed 1000 characters."],
    },
    trade: {
      type: Schema.Types.ObjectId,
      ref: "Trade",
      required: [true, "Trade is required."],
    },
    serviceArea: {
      type: Schema.Types.ObjectId,
      ref: "ServiceArea",
      required: [true, "Service area is required."],
    },
    budget: {
      type: Number,
      required: [true, "Budget is required."],
      min: [0, "Budget cannot be negative."],
      max: [1000000, "Budget cannot exceed 1,000,000."],
    },
    deadline: {
      type: Date,
      validate: {
        validator: function (value: Date) {
          return value > new Date(); // Deadline must be in the future
        },
        message: "Deadline must be a future date.",
      },
    },
    images: {
      type: [String],
      validate: [
        {
          validator: (images: string[]) => images.length <= 5,
          message: "A maximum of 5 images is allowed.",
        },
        {
          validator: (images: string[]) => 
            images.every((img) => img.startsWith("http") || img.startsWith("https")),
          message: "Each image must be a valid URL.",
        },
      ],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Tradesperson",
      required: [true, "CreatedBy (Tradesperson) is required."],
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    status: {
      type: String,
      enum: {
        values: ["open", "in-progress", "completed", "closed"],
        message: "Status must be one of: open, in-progress, completed, closed.",
      },
      default: "open",
    },
  },
  { timestamps: true }
);

export const Job = model<IJob>("Job", JobSchema);
