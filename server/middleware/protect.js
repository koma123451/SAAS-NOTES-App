import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";
import AppError from "../utils/AppError.js";

export const protect = async (req, res, next) => {
  const token =
    req.cookies.token ||
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new AppError("Not authorized", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("role isBanned");
    if (!user) {
      return next(new AppError("User no longer exists", 401));
    }

    if (user.isBanned) {
      return next(new AppError("Account is banned", 403));
    }

 
    req.user = {
      id: user._id,
      role: user.role,
    };
    req.userId = req.user.id;

    next();
  } catch (err) {
    return next(new AppError("Invalid token", 401));
  }
};
