import AppError from '../utils/AppError.js'
export const admin = (req, res, next) => {
  console.log("req.user",req.user.role)
  if (!req.user || req.user.role !== "admin") {
    console.log("req.user",req.user)
    console.log("req.user.role",req.user.role)
    return next(new AppError("Not authorized", 403));
  }
  next();
};
