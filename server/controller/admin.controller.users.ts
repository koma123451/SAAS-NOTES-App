import {User,IUser} from '../model/user.model.js';
import asyncHandler from "express-async-handler";
import AppError from '../utils/AppError.js'
import mongoose from 'mongoose'
import {
  getAllUsersService,
  getUserByIdService,
  toggleBanUserService} from '../services/admin.users.service.js'
export const getAllUsers=asyncHandler(async(req,res)=>{
  const {
    page,
    limit,
    search,
    sort,
  } = req.query as {
    page?: string;
    limit?: string;
    search?: string;
    sort?: string;
  };
  const result = await getAllUsersService({
    user:{
      userId: req.user.id,
      userRole: req.user.role
    },
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    search,
    sort,
  })
    res.status(200).json({    
        success:true,
        data:result.users,
        pagination: result.pagination
})
})

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };

  const user = await getUserByIdService({
    user: {
      userId: req.user.id,
      userRole: req.user.role,
    },
    targetUserId: id,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});


export const toggleBanUser = asyncHandler(async(req,res)=>{
  const{id}=req.params as {id:string};
  
  const user=await toggleBanUserService({
    user:{
      userId: req.user.id,
      userRole: req.user.role,
    },
    targetUserId: id
  })

  res.status(200).json({
    success: true,
    message: user.isBanned ? "User banned successfully" : "User unbanned successfully",
    isBanned: user.isBanned
  });
})

