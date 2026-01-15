import express from 'express';
import {registerUser,loginUser,logoutUser,getMe} from '../controller/auth.controller.js'
import {protect} from '../middleware/protect.js'
import {admin} from '../middleware/admin.js'
console.log('✅ auth.routes loaded')

const router = express.Router();
//User
router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/logout",logoutUser)
router.get("/me",protect,getMe)

export default router;