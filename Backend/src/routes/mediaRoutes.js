import express from "express";
import multer from "multer";
import { uploadMedia } from "../controllers/mediaController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();


// All routes require authentication
router.use(authMiddleware);

// Upload media for a specific story
// POST /api/media/upload/:storyId
router.post("/upload/:storyId", upload.single("file"), uploadMedia);

export default router;
