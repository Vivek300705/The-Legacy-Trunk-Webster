import express from 'express';
import { syncUser, getMyProfile } from '../controllers/authController.js';
// 👇 Import both middlewares
import authMiddleware, { verifyFirebaseToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ✅ Use the "light" middleware for the public sync route
router.post('/sync', verifyFirebaseToken, syncUser);

// ✅ Use the "full" middleware for protected routes that need a DB user
router.get('/me', authMiddleware, getMyProfile);

export default router;