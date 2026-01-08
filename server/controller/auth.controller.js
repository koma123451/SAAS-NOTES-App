import {User} from '../model/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from "express-async-handler";
import AppError from '../utils/AppError.js'
const isProd = process.env.NODE_ENV === "production";
const gen = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role, 
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const cookieOptions = {
  httpOnly: true,
  secure: isProd, 
  sameSite: isProd ? "none" : "lax", 
  path: "/",
};
export const registerUser=asyncHandler(async (req,res)=>{
  const {username,email,password}=req.body;
  
  // Input validation
  if(!username || !email || !password) {
    throw new AppError("Username, email and password are required", 400);
  }
  
  if(password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }
  
  const exists = await User.findOne({email});
  if(exists) {
    throw new AppError("Email already exists", 400);
  }
  
  const user = await User.create({username,email,password});
  res.cookie("token",gen(user),cookieOptions);
  
  // Return user info, excluding password
  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    }
  });
})

export const loginUser =asyncHandler(async (req,res)=>{
  const{email,password}=req.body;
  
  // Input validation
  if(!email || !password) {
    throw new AppError("Email and password are required", 400);
  }
  
  const user = await User.findOne({email});
  if(!user){
    throw new AppError("Invalid credentials", 401);
  }
  
  if(user.isBanned) {
    throw new AppError("Account is banned", 403);
  }
  
  const ok = await bcrypt.compare(password,user.password);
  if(!ok){
    throw new AppError("Invalid credentials", 401);
  } 
  
  res.cookie("token",gen(user),cookieOptions);
  res.json({ 
    success: true,
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    }
  });
})
export const logoutUser = asyncHandler(async(req,res)=>{
  res.clearCookie("token",cookieOptions);
  res.json({success:true,message:"Logged out"})
})


export const getMe = asyncHandler(async(req,res)=>{
  const user = await User.findById(req.user.id).select("-password");
  if(!user) {
    throw new AppError("User not found", 404);
  }
  res.json({
    success: true,
    data: user
  });
})