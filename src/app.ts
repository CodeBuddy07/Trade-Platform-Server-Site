import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { globalErrorHandler } from "./middlewares/error";
import tradeRoutes from "./routes/tradeRoutes";
import serviceAreaRoutes from "./routes/serviceAreaRoutes";
import jwtRoutes from "./routes/jwtRoutes";
import authRoutes from "./routes/authRoutes";
import cookieParser from 'cookie-parser';




//import morgan from "morgan";


dotenv.config();


const app: Application = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173',credentials: true,})); 
app.use(helmet()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser())
//app.use(morgan("dev")); // Logging


app.use("/api/auth", authRoutes); 
app.use("/api/auth", jwtRoutes); 
app.use("/api", tradeRoutes); 
app.use("/api", serviceAreaRoutes); 


app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Default route for unknown paths
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use(globalErrorHandler);


export default app;
