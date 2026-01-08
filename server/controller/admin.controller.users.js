import {User} from '../model/user.model.js';
import asyncHandler from "express-async-handler";
import AppError from '../utils/AppError.js'
import mongoose from 'mongoose'

export const getAllUsers=asyncHandler(async(req,res)=>{
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit)||8,10)
    const skip = (page-1)*limit;
    const search = req.query.search || "";
    const sortParam = req.query.sort || "createdAt:desc";
     // Parse sort parameters
    const [sortField,sortOrder]=sortParam.split(":")
    const sort = {
    [sortField]: sortOrder === "asc" ? 1 : -1,
    _id:sortOrder === "asc"? 1:-1, // Fallback when createdAt timestamps are nearly identical
  };
    // Query filter
      const filter = {
    ...(search && {
      email: { $regex: search, $options: "i" }, // Case-insensitive search
    }),
  };
  const [users, total] = await Promise.all([
      User.find(filter)
        .select("_id username email role createdAt isBanned")
        .sort(sort)
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);
    res.status(200).json({
        
        data:users,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
}
})
})

export const getUserById = asyncHandler(async(req,res)=>{
    const {id} =req.params;
        //ObjectId validation
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new AppError("Invalue user id",400)
    }
    const user = await User.findById(id,"-password")
    if(!user)  throw new AppError("User not found",404)
    res.status(200).json({data:user})
})


export const toggleBanUser = asyncHandler(async(req,res)=>{
  const{id}=req.params;
  
  // Input validation
  if(!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new AppError("Invalid user ID", 400);
  }
  
  if(req.user.id.toString() === id) {
    throw new AppError("You cannot ban yourself", 400);
  }
  
  const user = await User.findById(id);
  if(!user) {
    throw new AppError("User not found", 404);
  }
  
  // Prevent banning other admins
  if(user.role === "admin" && req.user.id.toString() !== id) {
    throw new AppError("Cannot ban another admin", 403);
  }
  
  user.isBanned = !user.isBanned;
  await user.save();
  
  res.status(200).json({
    success: true,
    message: user.isBanned ? "User banned successfully" : "User unbanned successfully",
    isBanned: user.isBanned
  });
})

