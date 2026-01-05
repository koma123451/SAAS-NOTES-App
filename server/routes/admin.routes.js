import express from 'express'
import {admin} from '../middleware/admin.js'
import {getAllUsers,toggleBanUser} from '../controller/admin.controller.users.js'
import {getAllNotes,deleteAnyNote,getUserNotes} from '../controller/admin.controller.notes.js'
import {protect} from '../middleware/protect.js'
const router = express.Router();
//Admin
//users
router.get("/users",protect,admin,getAllUsers)
// router.get("/allusers",getAllUsers)
//route
router.get("/notes",protect,admin,getAllNotes)
// router.get("/allnotes",getAllNotes)

router.post("/delete/:id",protect,admin,deleteAnyNote)

router.patch("/users/:id/ban",protect,admin,toggleBanUser)

//get single user notes by id
router.get("/users/:userId/notes",protect,admin,getUserNotes)
export default router;