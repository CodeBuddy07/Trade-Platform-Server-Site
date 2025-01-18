import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { createAppError } from "./error";


interface CustomRequest extends Request {
  user?: any;
}

export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.token; 

  if (!token) {
    return next(createAppError("Not authenticated, please log in.", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string); 
    req.user = decoded; 
    next();
  } catch (error) {
    return next(createAppError("Invalid or expired token.", 401));
  }
};
