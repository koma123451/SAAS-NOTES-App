// types/note.types.ts
import mongoose from 'mongoose'
import{INote} from '../model/note.model.js'
import { ActorContext,PaginationOptions,Pagination,NoteSummary } from './common.types.js'

// create Type
export interface CreateNoteInput extends ActorContext {
  title: string
  content: string
}

//update Type
export interface UpdateNoteInput extends ActorContext {
  noteId: string
  title?: string
  content?: string
}

// delete Type
export interface DeleteNoteInput extends ActorContext {
  noteId: string
}

// get Notes Type
export interface GetNotesInput extends PaginationOptions {
  userId:string
  search?: string
  sort?: string
}
// get Notes Result Type
export interface GetNotesResult  {
  notes:NoteSummary[]
  pagination: Pagination;
}
