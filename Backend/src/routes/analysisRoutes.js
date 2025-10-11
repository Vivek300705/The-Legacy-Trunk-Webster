import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getStoryAnalysis,
  triggerStoryAnalysis,
  getAllAITags,
  searchStoriesByAITags,
} from "../controllers/analysisController.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get analysis for a specific story
router.get("/story/:storyId", getStoryAnalysis);

// Trigger AI analysis for a story
router.post("/story/:storyId/analyze", triggerStoryAnalysis);

// Get all available AI tags
router.get("/tags/all", getAllAITags);

// Search stories by AI tags
router.get("/search", searchStoriesByAITags);

export default router;
