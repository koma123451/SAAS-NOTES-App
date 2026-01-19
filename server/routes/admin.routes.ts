import express from 'express';
import {admin} from '../middleware/admin.js';
import {getAllUsers, getUserById, toggleBanUser} from '../controller/admin.controller.users.js';
import {getAllNotes, deleteAnyNote, getUserNotes} from '../controller/admin.controller.notes.js';
import {protect} from '../middleware/protect.js';
import {getAuditLogs} from '../controller/auditLog.controller.js';
const router = express.Router();

// Admin routes - all require authentication and admin role
router.get("/users", protect, admin, getAllUsers);
router.get("/users/:id", protect, admin, getUserById);
router.patch("/users/:id/ban", protect, admin, toggleBanUser);
router.get("/users/:userId/notes", protect, admin, getUserNotes);
router.get("/audit-logs", protect, admin, getAuditLogs);
router.get("/notes", protect, admin, getAllNotes);
router.delete("/notes/:id", protect, admin, deleteAnyNote);

export default router;