import {User} from '../model/user.model.js';
import asyncHandler from "express-async-handler";
import AppError from '../utils/AppError.js'
import mongoose from 'mongoose'

export const getAllUsers=asyncHandler(async(req,res)=>{
    const users = await User.find()
    .select("_id username email role createdAt")
    .sort({createdAt:-1})
    // console.log("typeOf" ,typeof users)
     console.log("users",users)
    res.status(200).json({data:users})
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
  if(req.userId===id)throw new AppError("You cannot ban yourself",400)
  const user = await User.findById(id);
  if(!user) throw new AppError ("User not found",404)
    
      //return if user already banned
  user.isBanned=!user.isBanned;
  await user.save()
  res.status(200).json({
    success:true,
    message:"User banned successfully",
    isBanned:user.isBanned
  })
})