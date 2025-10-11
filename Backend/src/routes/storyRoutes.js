import express from "express";
import {
  createStory,
  getStoriesForFamily,
  updateStory,
  deleteStory,
  getUserStories,
  getFamilyCircleStories,
  getStoryById,
  searchStoriesByTags,
  getAllTags,
  // forceAnalyzeStory,
} from "../controllers/storyController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// ⭐ CRITICAL: Specific routes MUST come BEFORE parameterized routes!

// Create a new story
router.post("/", createStory);

// ✅ AI SEARCH ROUTES - MUST BE FIRST (before /:storyId)
router.get("/tags", getAllTags); // GET /stories/tags
router.get("/search-by-tags", searchStoriesByTags); // GET /stories/search-by-tags

// Get user's own stories
router.get("/user", getUserStories);

// Get stories for user's family circle
router.get("/family-circle", getFamilyCircleStories);

// Get stories for a specific family
router.get("/family/:familyId", getStoriesForFamily);

// ⚠️ PARAMETERIZED ROUTES COME LAST
// Get a specific story by ID (MUST be after specific routes!)
router.get("/:storyId", getStoryById);

// Update a specific story
router.put("/:storyId", updateStory);
router.patch("/:storyId", updateStory);

// Delete a specific story
router.delete("/:storyId", deleteStory);

export default router;
