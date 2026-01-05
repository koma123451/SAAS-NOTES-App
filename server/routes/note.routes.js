import express from 'express';
import {protect} from '../middleware/protect.js'
import {createNote,getNotes,updateNote,getNoteById} from '../controller/note.controller.js'

const router = express.Router();


router.post("/",protect,createNote)
router.get("/",protect,getNotes)
router.get("/:id",protect,getNoteById)
router.patch("/:id",protect,updateNote)


export default router;