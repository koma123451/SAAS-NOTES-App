import {Note} from '../model/note.model.js';
import asyncHandler from "express-async-handler";
import AppError from '../utils/AppError.js'
import mongoose from "mongoose";
import {getAllNotesService} from '../services/admin.notes.service.js'

export const getAllNotes = asyncHandler(async(req,res)=>{
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

  const result = await getAllNotesService({  
      user:{
        userId: req.user.id,
        userRole: req.user.role,
      },
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
      sort,
    
  })
  res.status(200).json({
    success: true,
    data: result.notes,
    pagination: result.pagination,
  });
})

export const deleteAnyNote = asyncHandler(async(req,res)=>{
  const {id} = req.params as {id:string};
  
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
  const { userId } = req.params as {userId:string};
   if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user id", 400);
  }
  const page = Math.max(parseInt(req.query.page as string) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit as string)||5,8)
  const skip = (page-1)*limit;
  const sortParam = req.query.sort as string || "createdAt:desc";
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
      .sort(sort as any)
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
