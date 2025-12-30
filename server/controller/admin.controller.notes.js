import {Note} from '../model/note.model.js';
import asyncHandler from "express-async-handler";
import AppError from '../utils/AppError.js'


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

