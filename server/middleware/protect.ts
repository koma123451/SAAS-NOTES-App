import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";
import AppError from "../utils/AppError.js";
import express from "express";

export const protect = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log("Protect middleware invoked");
  const token =
    req.cookies.token ||
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new AppError("Not authorized", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)as{id:string};

    const user = await User.findById(decoded.id).select("role isBanned");
    if (!user) { 
      return next(new AppError("User no longer exists", 401));
    }

    if (user.isBanned) {
      return next(new AppError("Account is banned", 403));
    }

 
    req.user = {
      id: user._id.toString(),
      role: user.role,
    };

    // Keep backward compatibility
    // req.userId = req.user.id;

    next();
  } catch (err) {
    return next(new AppError("Invalid token", 401));
  }
};
