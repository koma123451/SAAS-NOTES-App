import {Note} from '../model/note.model.js';
import asyncHandler from "express-async-handler";
import AppError from '../utils/AppError.js'
import mongoose from "mongoose";
import {
  getAllNotesService,
  deleteAnyNoteService,
  getUserNotesService,
} from '../services/admin.notes.service.js'

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
  await deleteAnyNoteService({
    user:{
      userId: req.user.id,
      userRole: req.user.role,
    },
    id:id
  });
  
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
   const result = await getUserNotesService({  
      user:{
        userId: req.user.id,
        userRole: req.user.role,
      },
      userId: userId,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
      sort,
    
  })
  res.status(200).json({
    success:true,
    data: result.notes,
    pagination: result.pagination
  });
});
