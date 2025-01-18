import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { globalErrorHandler } from "./middlewares/error";
import tradeRoutes from "./routes/tradeRoutes";
import authRoutes from "./routes/authRoutes";


//import morgan from "morgan";


dotenv.config();


const app: Application = express();

// Middleware
app.use(cors()); 
app.use(helmet()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
//app.use(morgan("dev")); // Logging


app.use("/api/auth", authRoutes); 
app.use("/api", tradeRoutes); 


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
