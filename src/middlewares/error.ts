import { Request, Response, NextFunction } from "express";


class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}


export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if (process.env.NODE_ENV === "development") {
    console.error("ERROR:", err);
    console.error("Request URL:", req.originalUrl);
    console.error("Request Method:", req.method);
    console.error("Request Body:", req.body);
    console.error("Stack Trace:", err.stack);
  } else if (process.env.NODE_ENV === "production") {

    if (err.isOperational) {
      console.error("ERROR:", err.message);
    } else {
      console.error("ERROR:", "An unknown error occurred.");
    }
  }


  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.isOperational
      ? err.message
      : "Something went wrong, please try again later.",
  });
};


export const createAppError = (
  message: string,
  statusCode: number
): AppError => {
  return new AppError(message, statusCode);
};
