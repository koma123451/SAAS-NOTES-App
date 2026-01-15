import {Note,INote} from '../model/note.model.js'
import asyncHandler from "express-async-handler";
import AppError from '../utils/AppError.js'
import { Request, Response } from "express";
import  {
  updateNoteService,
  deleteNoteService,
  createNoteService,
  getNotesService,
  getNoteByIdService} from '../services/note.service.js'
export const createNote= asyncHandler(async(req: Request,res: Response)=>{
  console.log("Creating note with body:", req.body);
 const {title,content} = req.body;
 const note = await createNoteService({
    userId: req.user.id,
    userRole: req.user.role,
    title,
    content})
  // Emit real-time event
  const io = req.app.get("io");
  if(io) {
    io.emit("note:created", { id: note._id });
  }

  res.status(201).json({
    success: true,
    data: note
  });
})

export const updateNote = asyncHandler (async (req, res) => {
  const {title,content}=req.body;
  const {id} = req.params as {id: string};

  // Input validation
  if(!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new AppError("Invalid note ID", 400);
  }
  
 const note = await updateNoteService({
    noteId: id,
    userId: req.user.id, 
    userRole: req.user.role,
    title,
    content,
  });
  res.status(200).json({
    success: true,
    data: note
  });
})


export const deleteNote =asyncHandler (async (req, res) => {
  const {id}=req.params as {id: string};
  
  // Input validation
  if(!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new AppError("Invalid note ID", 400);
  }
  
  await deleteNoteService({
    noteId: id,
    userId: req.user.id,
    userRole: req.user.role,
  });
  
  res.status(204).json({
    success: true,
    message: "Note deleted successfully"
  });
})

export const getNotes = asyncHandler(async (req, res) => {
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

  const result = await getNotesService({
    userId: req.user.id,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    search,
    sort,
  });

  res.status(200).json({
    success: true,
    data: result.notes,
    pagination: result.pagination,
  });
});



export const getNoteById =asyncHandler( async (req, res) => {
  const {id}=req.params as {id: string};
  
  if(!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new AppError("Invalid note ID", 400);
  }
  const note = await getNoteByIdService(id);
   if(!note) {
    throw new AppError("Note not found", 404);
  }
  
  // Check permission: users can only view their own notes
  if(note.userId.toString() !== req.user.id.toString() && req.user.role !== "admin") {
    throw new AppError("Not authorized to view this note", 403);
  }
  
  res.status(200).json({
    success: true,
    data: { note }
  });
})


