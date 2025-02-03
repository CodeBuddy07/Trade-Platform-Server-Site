import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Admin } from "../src/models/admin";

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI as string);

    // Check if a superadmin already exists
    const existingSuperAdmin = await Admin.findOne({
      email: process.env.SUPERADMIN_EMAIL,
    });
    if (existingSuperAdmin) {
      console.log("Superadmin already exists.");
      return;
    }

    // Create a superadmin
    const hashedPassword = await bcrypt.hash(
      process.env.SUPERADMIN_PASSWORD as string,
      12
    );
    const superAdmin = new Admin({
      fullName: "Superadmin",
      email: process.env.SUPERADMIN_EMAIL,
      password: hashedPassword,
      role: "superadmin",
    });

    await superAdmin.save();
    console.log("Superadmin created successfully.");
  } catch (error) {
    console.error("Error seeding superadmin:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedAdmin();
