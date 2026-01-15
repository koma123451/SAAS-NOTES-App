import asyncHandler from "express-async-handler";
import AppError from '../utils/AppError.js'
const isProd = process.env.NODE_ENV === "production";
import { CookieOptions } from 'express';
import { loginUserService,registerUserService,getCurrentUser } from '../services/auth.service.js';


const cookieOptions:CookieOptions= {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // ✅ 7 days
};

export const registerUser=asyncHandler(async (req,res)=>{
  const {username,email,password}=req.body;
  
  // Input validation
  if(!username || !email || !password) {
    throw new AppError("Username, email and password are required", 400);
  }
  
  const result = await registerUserService({username,email,password});
  
  res.cookie("token",result.token,cookieOptions);
  
  // Return user info, excluding password
  res.status(201).json({
    success: true,
    data: {
      user: result.user
    }
  });
})

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const result = await loginUserService({ email, password });

  res.cookie("token", result.token, cookieOptions);

  res.status(200).json({
    success: true,
    data: {
      user: result.user,
    },
  });
});

export const logoutUser = asyncHandler(async(req,res)=>{
  res.clearCookie("token",cookieOptions);
  res.json({success:true,message:"Logged out"})
})


export const getMe = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  res.json({
    success: true,
    data: user,
  });
});
