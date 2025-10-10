import express from 'express';
import { exportStoriesAsPDF } from '../controllers/exportController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// This route is protected, only a logged-in user can export stories
router.get('/stories/pdf', authMiddleware, exportStoriesAsPDF);

export default router;