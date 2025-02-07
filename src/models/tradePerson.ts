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
  jobGalleries: [{
    publicId: string | null;
    url: string | null;
  }
];
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
    jobGalleries: [
      {
        publicId: {
          type: String,
          default: null, // Optional if the image is not required
        },
        url: {
          type: String,
          default: null,
          validate: {
            validator: function (value: string) {
              return /^https?:\/\/.*/.test(value);
            },
            message: "Invalid URL format",
          },
        },
      },
    ],
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

// Helper function to check if a field is filled
function isFilled(value: any): boolean {
  if (value === undefined || value === null) return false; // Skip undefined or null
  if (typeof value === "string" && value.trim() === "") return false; // Empty strings are not filled
  if (Array.isArray(value) && value.length === 0) return false; // Empty arrays are not filled
  if (typeof value === "object" && Object.keys(value).length === 0) return false; // Empty objects are not filled
  return true; // Otherwise consider it filled
}

// Recursive function to iterate over an object or array
function countFilledFields(data: any): number {
  let filledFields = 0;

  // If it's an object, iterate through its properties
  if (typeof data === "object" && !Array.isArray(data)) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (isFilled(data[key])) {
          filledFields++;
        }
        // Recursively count for nested objects
        if (typeof data[key] === "object") {
          filledFields += countFilledFields(data[key]);
        }
      }
    }
  }
  // If it's an array, check each element
  else if (Array.isArray(data)) {
    data.forEach(item => {
      if (isFilled(item)) {
        filledFields++;
      }
      // Recursively count for nested arrays/objects
      if (typeof item === "object") {
        filledFields += countFilledFields(item);
      }
    });
  }

  return filledFields;
}

// Main function to calculate profile completion
TradePersonSchema.virtual("profileCompletion").get(function (this: ITradePerson) {
  const data = this.toObject({ virtuals: false });
  const ignoredFields = ["_id", "__v", "createdAt", "updatedAt"];

  // Count total relevant fields (excluding ignored fields)
  const totalFields = Object.keys(TradePersonSchema.paths).filter(
    (field) => !ignoredFields.includes(field)
  ).length;

  // Count the filled fields using the recursive function
  let filledFields = 0;
  Object.keys(data).forEach(key => {
    if (!ignoredFields.includes(key)) {
      filledFields += countFilledFields(data[key]);
    }
  });

  // Calculate and return the completion percentage
  return Math.round((filledFields / totalFields) * 100);
  //return totalFields;
});



TradePersonSchema.set("toJSON", { virtuals: true });
TradePersonSchema.set("toObject", { virtuals: true });

export const TradesPerson = mongoose.model<ITradePerson>("TradePerson", TradePersonSchema);
