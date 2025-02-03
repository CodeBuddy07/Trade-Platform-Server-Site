import { model, Schema } from "mongoose";

export interface IServiceArea extends Document {
    name: string;
  }
  
  const ServiceAreaSchema = new Schema<IServiceArea>(
    {
      name: {
        type: String,
        required: [true, "Service area name is required."],
        unique: true,
        trim: true,
        minlength: [3, "Service area name must be at least 3 characters long."],
        maxlength: [100, "Service area name cannot exceed 100 characters."],
      },

    },
    { timestamps: true }
  );
  
  export const ServiceArea = model<IServiceArea>("ServiceArea", ServiceAreaSchema);
  