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
     // 排序解析
    const [sortField,sortOrder]=sortParam.split(":")
    const sort = {
    [sortField]: sortOrder === "asc" ? 1 : -1,
    _id:sortOrder === "asc"? 1:-1, //如果createdAt时间几乎一样，这个是兜底
  };
    //查询条件
      const filter = {
    ...(search && {
      email: { $regex: search, $options: "i" }, // 模糊搜索
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
    // console.log("typeOf" ,typeof users)
     console.log("users",users)
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

