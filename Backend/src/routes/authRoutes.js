import express from 'express';
import { syncUser } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// This route will be hit by the frontend right after a successful Firebase signup/login
// The authMiddleware runs first to verify the firebase user
router.post('/sync', authMiddleware, syncUser);

export default router;