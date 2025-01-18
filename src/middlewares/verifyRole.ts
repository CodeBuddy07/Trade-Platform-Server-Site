import { NextFunction, Request, Response } from "express";
import { createAppError } from "./error";

interface CustomRequest extends Request {
  user?: any;
}

export const verifyRole = (...roles: string[]) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(createAppError("Not authenticated, please log in.", 401));
      }
  
      if (!roles.includes(req.user.role)) {
        return next(createAppError("Access denied: insufficient permissions.", 403));
      }
  
      next();
    };
  };
  