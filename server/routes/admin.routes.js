import express from 'express'
import {admin} from '../middleware/admin.js'
import {getAllUsers,toggleBanUser} from '../controller/admin.controller.users.js'
import {getAllNotes,deleteAnyNote} from '../controller/admin.controller.notes.js'
import {protect} from '../middleware/protect.js'
const router = express.Router();
//Admin
//users
// router.get("/allusers",protect,admin,getAllUsers)
router.get("/allusers",getAllUsers)
//route
// router.get("allnotes",protect,admin,getAllNotes)
router.get("/allnotes",getAllNotes)

router.post("delete/:id",deleteAnyNote)

router.patch("/users/:id/ban",toggleBanUser)
export default router;