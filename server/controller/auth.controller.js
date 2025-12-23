import {User} from '../model/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const isProd = process.env.NODE_ENV === "production";
const gen=(id)=>jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"7d"});
const cookieOptions = {
  httpOnly: true,
  secure: isProd, 
  sameSite: isProd ? "none" : "lax", 
  path: "/",
};
export const registerUser=async (req,res)=>{

  const {username,email,password}=req.body;
  console.log("Register Username:",username)
  console.log("Register Email:",email)
  const exists = await User.findOne({email});
  if(exists) return res.status(400).json({message:"Email already exist"});
  const user =await User.create({username,email,password});
  res.cookie("token",gen(user._id),cookieOptions);
  res.json(user);
}

export const loginUser = async (req,res)=>{
  console.log("req.body:",req.body)
  const{email,password}=req.body;

  const user = await User.findOne({email});
  if(!user) return res.status(400).json({message:"invalid credentials!"})
  const ok = await bcrypt.compare(password,user.password);
  if(!ok) return res.status(400).json({message:"Invalid ps"});
  res.cookie("token",gen(user._id),cookieOptions);
 // res.json({id:user._id,username:user.username,email:user.email})
  res.json({ success: true });
}

export const logoutUser = async(req,res)=>{
  res.clearCookie("token",cookieOptions);
  res.json({success:true,message:"Logged out"})
}

export const getMe = async(req,res)=>{
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
}