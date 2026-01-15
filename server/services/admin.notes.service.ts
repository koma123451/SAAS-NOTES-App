import AppError from "../utils/AppError.js";
import mongoose from "mongoose";
import { normalizePagination } from "./_shared/pagination.js";
import {parseSort} from "./_shared/sort.js";
import { Note } from "../model/note.model.js";
import {
getAllNotesInput,
getAllNotesResult,} from "../types/admin.types.js"
import { AdminNoteSummary } from "../types/common.types.js";

export async function getAllNotesService(
  { page, limit, user, search, sort }: getAllNotesInput
): Promise<getAllNotesResult> {

  const { page: safePage, limit: safeLimit, skip } =
    normalizePagination(page, limit, 10);

  const sortQuery = parseSort(sort);

  const filter = {
    userId: user.userId,
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
  isDeleted: note.isDeleted, // 如果你有 soft delete
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
