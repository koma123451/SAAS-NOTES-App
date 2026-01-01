import {Note} from '../model/note.model.js';
import asyncHandler from "express-async-handler";
import AppError from '../utils/AppError.js'
import mongoose from "mongoose";

export const getAllNotes = asyncHandler(async(req,res)=>{
  const notes = await Note.find();
  // console.log("notes",notes)
  res.status(200).json({data:notes})
})

export const deleteAnyNote = asyncHandler(async(req,res)=>{
  const {id} = req.params;
  if(!mongoose.Types.ObjectId.isValid(id)) throw new AppError("bad request",400)
  const note=await Note.findById(id);
  if(!note) throw new AppError("note note found",404)
  await Note.findOneAndDelete(note);
  res.status(200).json({success:true})
})

export const getUserNotes = asyncHandler(async (req, res) => {
  const { userId } = req.params;
   if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user id", 400);
  }
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit)||5,8)
  const skip = (page-1)*limit;
  const sortParam = req.query.sort || "createdAt:desc";
   // 排序解析
   const [sortField,sortOrder]=sortParam.split(":");
   const sort={
    [sortField]:sortOrder==="asc"?1:-1,
    _id:sortOrder === "asc"?1:-1, //如果createdAt时间几乎一样，这个是兜底
   }
   //查询条件
    const [notes, total] = await Promise.all([
    Note.find({ userId })
      .select("title content createdAt")
      .sort(sort)
      .skip(skip)
      .limit(limit),
      Note.countDocuments({ userId })
  ]);
  res.status(200).json({
    success:true,
    data: notes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});
