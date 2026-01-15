import AppError from '../utils/AppError.js'
import express from "express";
export const admin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
 
  if (!req.user || req.user.role !== "admin") {
    return next(new AppError("Not authorized", 403));
  }
  next();
};
