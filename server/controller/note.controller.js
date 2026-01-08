import {Note} from '../model/note.model.js'
import asyncHandler from "express-async-handler";
import AppError from '../utils/AppError.js'

export const createNote= asyncHandler(async(req,res)=>{
 const {title,content} = req.body;
 
 // Input validation
 if(!title || !content){
  throw new AppError("Title and content are required", 400);
 }
 
 if(title.trim().length === 0 || content.trim().length === 0) {
   throw new AppError("Title and content cannot be empty", 400);
 }
 
 const exist = await Note.findOne({
  title: title.trim(),
  userId: req.user.id
});
  
  if(exist){
    throw new AppError("A note with this title already exists", 409);
  }
  
  const note = await Note.create({
    title: title.trim(),
    content: content.trim(),
    userId: req.user.id
  });
  
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
export const getNotes = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 3, 10);
  const skip = (page - 1) * limit;

  const search = req.query.search || "";
  const sortParam = req.query.sort || "createdAt:desc";

  // Parse sort parameters
  const [sortField, sortOrder] = sortParam.split(":");
  const sort = {
    [sortField]: sortOrder === "asc" ? 1 : -1,
    _id: sortOrder === "asc" ? 1 : -1, // Fallback when createdAt timestamps are nearly identical
  };

  // Query filter
  const filter = {
    userId: req.user.id,
    ...(search && {
      title: { $regex: search, $options: "i" }, // Case-insensitive search
    }),
  };

  const [notes, total] = await Promise.all([
    Note.find(filter)
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
});


export const getNoteById =asyncHandler( async (req, res) => {
  const {id}=req.params;
  
  if(!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new AppError("Invalid note ID", 400);
  }
  
  const note = await Note.findById(id);
  
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
export const updateNote = asyncHandler (async (req, res) => {
  const {title,content}=req.body;
  const {id} = req.params;
  
  // Input validation
  if(!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new AppError("Invalid note ID", 400);
  }
  
  if(!title && !content) {
    throw new AppError("At least title or content must be provided", 400);
  }
  
  const note = await Note.findById(id);
  if(!note) {
    throw new AppError("Note not found", 404);
  }
  
  // Permission check: users can only update their own notes
  if(note.userId.toString() !== req.user.id.toString() && req.user.role !== "admin") {
    throw new AppError("Not authorized to update this note", 403);
  }
  
  // Check for duplicate title
  if(title && title.trim() !== note.title) {
    const exist = await Note.findOne({
      title: title.trim(),
      userId: req.user.id,
      _id: { $ne: id }
    });
    if(exist) {
      throw new AppError("A note with this title already exists", 409);
    }
  }
  
  // Build update object
  const updateData = {};
  if(title !== undefined) updateData.title = title.trim();
  if(content !== undefined) updateData.content = content.trim();
  
  const updatedNote = await Note.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );
  
  res.status(200).json({
    success: true,
    data: updatedNote
  });
})


export const deleteNote =asyncHandler (async (req, res) => {
  const {id}=req.params;
  
  // Input validation
  if(!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new AppError("Invalid note ID", 400);
  }
  
  const note = await Note.findById(id);
  if(!note) {
    throw new AppError("Note not found", 404);
  }
  
  // Permission check: users can only delete their own notes
  if(note.userId.toString() !== req.user.id.toString() && req.user.role !== "admin") {
    throw new AppError("Not authorized to delete this note", 403);
  }
  
  await Note.findByIdAndDelete(id);
  
  res.status(200).json({
    success: true,
    message: "Note deleted successfully"
  });
})