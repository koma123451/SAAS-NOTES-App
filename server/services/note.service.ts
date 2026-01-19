import {Note,INote} from '../model/note.model.js'
import {createAuditLog} from './audit-log.service.js'
import mongoose from 'mongoose'
import AppError from '../utils/AppError.js'
import type { SortOrder } from "mongoose";
import type { 
  CreateNoteInput,
  DeleteNoteInput,
  UpdateNoteInput,GetNotesInput,
  GetNotesResult} 
  from '../types/note.types.js'


export async function updateNoteService({
  noteId,
  userId,
  userRole,
  title,
  content,
}: UpdateNoteInput) : Promise<INote> {
 if (title === undefined && content === undefined) {
  throw new AppError('Nothing to update', 400)
}

  const note = await Note.findById(noteId)
  if (!note) throw new AppError('Note not found',404)

  // Permission check: users can only update their own notes
  if(note.userId.toString() !==userId.toString() && userRole!== "admin") {
    throw new AppError("Not authorized to update this note", 403);
  }
  //a copy of old data for audit log
  const before=note.toObject()

  if(title && title.trim() !== note.title) {
    const exist = await Note.findOne({
      title: title.trim(),
      userId:note.userId,
      _id: { $ne: note._id }
    });
    if(exist) {
      throw new AppError("A note with this title already exists", 409);
    }
  }

  if (title !== undefined) note.title = title.trim()
  if (content !== undefined) note.content = content.trim()
  await note.save()
  const after=note.toObject()

      try {
       //  audit log
      await createAuditLog({
      actorId: userId,
        actorRole: userRole,
        action: 'UPDATE_NOTE',
        targetType: 'note',
        targetId: note._id.toString(),
        metadata: { before,after }
  })
    } catch (err) {
      console.error("audit failed", err);
    }



  return note
}

export async function deleteNoteService({
  noteId,
  userId,
  userRole,
}: DeleteNoteInput) : Promise<void> {
  const note = await Note.findById(noteId);
   if(!note) {
      throw new AppError("Note not found", 404);
    }
 // Permission check: users can only delete their own notes
   if(note.userId.toString() !== userId.toString() && userRole !== "admin") {
     throw new AppError("Not authorized to delete this note", 403);
   }
   const before=note.toObject()

  // Soft delete
  note.isDeleted = true;
  note.deletedAt = new Date();
  await note.save();
   try {
    //audit log
      await createAuditLog({
        actorId: userId,
        actorRole: userRole,
        action: 'DELETE_NOTE',
        targetType: 'note',
        targetId: note._id.toString(),
        metadata: { before, after: { isDeleted: true, deletedAt: note.deletedAt } }
      })
      } catch (err) {
        console.error("audit failed", err);
      }
   return
}
export async function createNoteService({
  userId,
  userRole,
  title,
  content,
}: CreateNoteInput): Promise<INote>
  {
     // Input validation
       if (!title?.trim() || !content?.trim()) {
      throw new AppError("Title and content are required", 400);
      }

     const exist = await Note.findOne({
      title: title.trim(),
      userId: userId
    });
     
      if(exist){
        throw new AppError("A note with this title already exists", 409);
      }

    const note = await Note.create({
    title: title.trim(),
    content: content.trim(),
    userId: userId
  });
    try {
   // audit log
    await createAuditLog({
    actorId: userId,
    actorRole: userRole,
    action: 'CREATE_NOTE',
    targetType: 'note',
    targetId: note._id.toString(),
  })
    } catch (err) {
      console.error("audit failed", err);
    }

  
 
      return note
  }
  
export async function getNotesService({page,limit,userId,search,sort}:GetNotesInput): Promise<GetNotesResult> {

  const safePage = Math.max(page ?? 1, 1);
  const safeLimit = Math.min(limit ?? 3, 10);
  const skip = (safePage - 1) * safeLimit;
  const sortParam = sort || "createdAt:desc";
  //Parse sort parameters
  const [sortField, sortOrder] = sortParam.split(":");
  const sortQuery: Record<string, SortOrder> = {
  [sortField]: sortOrder === "asc" ? 1 : -1,
  _id: sortOrder === "asc" ? 1 : -1,
};
  const filter = {
    userId,
    ...(search && {
      title: { $regex: search, $options: "i" }, // Case-insensitive search
    }),
  };
  const [notes, total] = await Promise.all([
      Note.find(filter)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit as number),
      Note.countDocuments(filter),
    ]);
    return {
    notes,
    pagination: {
    page: safePage,
    limit: safeLimit,
    total,
    totalPages: Math.ceil(total / safeLimit),
  },
};
}
export async  function getNoteByIdService(noteId: string): Promise<INote | null> {

  const note =Note.findById(noteId);
  return note;
} 