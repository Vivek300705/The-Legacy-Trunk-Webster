import express from "express";
import multer from "multer";
import { uploadMedia } from "../controllers/mediaController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Configure multer for memory storage (required for Cloudinary buffer upload)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    // Accept images, videos, and audio files
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/") ||
      file.mimetype.startsWith("audio/")
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only images, videos, and audio are allowed."
        )
      );
    }
  },
});

// All routes require authentication
router.use(authMiddleware);

// Upload media for a specific story
// POST /api/media/upload/:storyId
router.post("/upload/:storyId", upload.single("file"), uploadMedia);

export default router;
