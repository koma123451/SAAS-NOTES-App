import {User} from '../model/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from "express-async-handler";
import AppError from '../utils/AppError.js'
const isProd = process.env.NODE_ENV === "production";
const gen=(id)=>jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"7d"});
const cookieOptions = {
  httpOnly: true,
  secure: isProd, 
  sameSite: isProd ? "none" : "lax", 
  path: "/",
};
export const registerUser=asyncHandler(async (req,res)=>{

  const {username,email,password}=req.body;
  console.log("Register Username:",username)
  console.log("Register Email:",email)
  const exists = await User.findOne({email});
  if(exists) {
    throw new AppError("Email already existed",400)
  }
  const user =await User.create({username,email,password});
  res.cookie("token",gen(user._id),cookieOptions);
  res.json(user);
})

export const loginUser =asyncHandler(async (req,res)=>{
  console.log("req.body:",req.body)
  const{email,password}=req.body;
  const user = await User.findOne({email});
  if(!user){
    throw new AppError("invalid credentials!",400)
  } 
  const ok = await bcrypt.compare(password,user.password);
  if(!ok){
    throw new AppError("Invalid ps",400)
  } 
  res.cookie("token",gen(user._id),cookieOptions);
 // res.json({id:user._id,username:user.username,email:user.email})
  res.json({ success: true });
}
)
export const logoutUser = asyncHandler(async(req,res)=>{
  res.clearCookie("token",cookieOptions);
  res.json({success:true,message:"Logged out"})
})


export const getMe = asyncHandler(async(req,res)=>{
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
})