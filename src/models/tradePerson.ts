import mongoose, { Schema, Document } from "mongoose";

export interface ITradePerson extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  trade: mongoose.Schema.Types.ObjectId; // Reference to Trade
  experience: number;
  postCode: string;
  certifications: {
    publicId: string;
    url: string;
  };
  profileImage: {
    publicId: string;
    url: string;
  }; 
  company?: {
    name?: string;
    proofOfInsurance?: {
      publicId: string;
      url: string;
    };
    registrationNumber?: string;
  };
  bio?: string;
  businessType?: string;
  companyWebsite?: string;
  employeeCount?: number;
  jobGalleries?: string[]; // Array of Cloudinary URLs
  skills?: string[]; // Array of skill names
  homeAddress?: {
    addressLine1: string;
    addressLine2?: string;
    town: string;
    postCode: string;
    country: string;
  };
  businessAddress?: {
    addressLine1: string;
    addressLine2?: string;
    town: string;
    postCode: string;
    country: string;
  };
}

const TradePersonSchema = new Schema<ITradePerson>(
  {
    firstName: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    lastName: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Validates email format
    },
    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10,15}$/, // Validates phone number (10-15 digits)
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Min length for password security
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "superAdmin", "customer", "tradePerson"]
    },
    trade: { type: Schema.Types.ObjectId, ref: "Trade", required: true }, // Linking to Trade model
    experience: { type: Number, required: true, min: 0, max: 50 },
    postCode: { type: String, required: true, match: /^[A-Z0-9]{4,10}$/i }, // UK-like postcodes
    certifications:{
      publicId: {
        type: String,
        default: null, // Optional if the image is not required
      },
      url: {
        type: String,
        default: null,
      },
    },
    profileImage: {
      publicId: {
        type: String,
        default: null, // Optional if the image is not required
      },
      url: {
        type: String,
        default: null,
      },
    },

    company: {
      name: { type: String, trim: true, maxlength: 100 },
      proofOfInsurance: {
        publicId: {
          type: String,
          default: null, // Optional if the image is not required
        },
        url: {
          type: String,
          default: null,
        },
      },
      registrationNumber: { type: String, maxlength: 20 },
    },

    bio: { type: String, trim: true, maxlength: 500 },
    businessType: { type: String },
    companyWebsite: { type: String, match: /^https?:\/\/.*/ },
    employeeCount: { type: Number, min: 1, max: 5000 },
    jobGalleries: { type: [String], validate: (arr: string[]) => arr.every((url) => /^https?:\/\/.*/.test(url)) },
    skills: { type: [String] }, // Array of skill names

    homeAddress: {
      addressLine1: { type: String,  trim: true },
      addressLine2: { type: String, trim: true },
      town: { type: String,  trim: true },
      postCode: { type: String,  match: /^[A-Z0-9]{4,10}$/i },
      country: { type: String,  trim: true },
    },
    businessAddress: {
      addressLine1: { type: String, trim: true },
      addressLine2: { type: String, trim: true },
      town: { type: String, trim: true },
      postCode: { type: String, match: /^[A-Z0-9]{4,10}$/i },
      country: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

export const TradesPerson = mongoose.model<ITradePerson>("TradePerson", TradePersonSchema);
