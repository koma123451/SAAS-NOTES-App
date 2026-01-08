import {Note} from '../model/note.model.js';
import asyncHandler from "express-async-handler";
import AppError from '../utils/AppError.js'
import mongoose from "mongoose";

export const getAllNotes = asyncHandler(async(req,res)=>{
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  const search = req.query.search || "";
  const sortParam = req.query.sort || "createdAt:desc";

  // Parse sort parameters
  const [sortField, sortOrder] = sortParam.split(":");
  const sort = {
    [sortField]: sortOrder === "asc" ? 1 : -1,
    _id: sortOrder === "asc" ? 1 : -1,
  };

  // Query filter
  const filter = {};
  if(search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } }
    ];
  }

  const [notes, total] = await Promise.all([
    Note.find(filter)
      .populate("userId", "username email")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Note.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: notes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
})

export const deleteAnyNote = asyncHandler(async(req,res)=>{
  const {id} = req.params;
  
  if(!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid note ID", 400);
  }
  
  const note = await Note.findById(id);
  if(!note) {
    throw new AppError("Note not found", 404);
  }
  
  await Note.findByIdAndDelete(id);
  
  res.status(200).json({
    success: true,
    message: "Note deleted successfully"
  });
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
   // Parse sort parameters
   const [sortField,sortOrder]=sortParam.split(":");
   const sort={
    [sortField]:sortOrder==="asc"?1:-1,
    _id:sortOrder === "asc"?1:-1, // Fallback when createdAt timestamps are nearly identical
   }
   // Query filter
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
