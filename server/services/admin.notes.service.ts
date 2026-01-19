import AppError from "../utils/AppError.js";
import mongoose from "mongoose";
import { normalizePagination } from "./_shared/pagination.js";
import {parseSort} from "./_shared/sort.js";
import { Note } from "../model/note.model.js";
import {
getAllNotesInput,
getAllNotesResult,
GetUserNotesInput,
GetUserNotesResult,
DeleteAnyNoteInput} from "../types/admin.types.js"
import { AdminNoteSummary } from "../types/common.types.js";
import {createAuditLog} from './audit-log.service.js'
export async function getAllNotesService(
  { page, limit, user, search, sort }: getAllNotesInput
): Promise<getAllNotesResult> {
  if (user.userRole !== "admin") {
    throw new AppError("Forbidden", 403);
  } 
  const { page: safePage, limit: safeLimit, skip } =
    normalizePagination(page, limit, 10);

  const sortQuery = parseSort(sort);

  const filter = {
    isDelete:false,
    ...(search && {
      title: { $regex: search, $options: "i" },
    }),
  };

  const [notes, total] = await Promise.all([
    Note.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(safeLimit),
    Note.countDocuments(filter),
  ]);
  const noteSummaries: AdminNoteSummary[] = notes.map((note) => ({
  id: note._id.toString(),
  title: note.title,
  content: note.content,
  userId: note.userId.toString(),
  createdAt: note.createdAt,
  updatedAt: note.updatedAt,
  isDeleted: note.isDeleted, //soft delete
}));

  return {
    notes:noteSummaries,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
}

export async function deleteAnyNoteService(
  { user, id }: DeleteAnyNoteInput
): Promise<void> {

  if (user.userRole !== "admin") {
    throw new AppError("Forbidden", 403);
  }

  const note = await Note.findById(id);
  if (!note) {
    throw new AppError("Note not found", 404);
  }

  // ✅ 记录旧状态
  const before = note.toObject();

  // ✅ 强制 soft delete
  note.isDeleted = true;
  note.deletedAt = new Date();
  await note.save();

  // ✅ audit log
  try {
   await createAuditLog({
    actorId: user.userId,
    actorRole: "admin",
    action: "DELETE_NOTE",
    targetType: "note",
    targetId: id,
    metadata: {
      before,
      after: {
        isDeleted: true,
        deletedAt: note.deletedAt,
      },
      deletedBy: "admin",
    },
  });
} catch (err) {
  console.error("audit failed", err);
}

 
  return
}


export async function getUserNotesService(
  { user,userId, page, limit, search, sort }: GetUserNotesInput
): Promise<GetUserNotesResult> {
console.log("Admin fetching notes for user:", userId)
  if(user.userRole !== "admin") {
    throw new AppError("Forbidden", 403);
  }
  const { page: safePage, limit: safeLimit, skip } =
    normalizePagination(page, limit, 10);
    const sortQuery = parseSort(sort);
   const filter = {
    userId,
    isDeleted:false,
    ...(search && {
      title: { $regex: search, $options: "i" },
    }),
  
  };
    console.log("Filter applied:", filter)
    const [notes, total] = await Promise.all([
    Note.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(safeLimit),
    Note.countDocuments(filter),
  ]);
  console.log("Total notes found:", total)
  const noteSummaries: AdminNoteSummary[] = notes.map((note) => ({
  id: note._id.toString(),
  title: note.title,
  content: note.content,
  userId: note.userId.toString(),
  createdAt: note.createdAt,
  updatedAt: note.updatedAt,
  isDeleted: note.isDeleted, // 如果你有 soft delete
}));
console.log("Fetched notes:", noteSummaries)

    return {
    notes:noteSummaries,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
}