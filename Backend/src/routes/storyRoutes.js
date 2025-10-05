import express from "express";
import {
  createStory,
  getStoriesForFamily,
  updateStory,
  deleteStory,
  getUserStories,
  getFamilyCircleStories,
  getStoryById,
} from "../controllers/storyController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// ✅ IMPORTANT: Specific routes MUST come before generic/parameterized ones

// Create a new story
router.post("/", createStory);

// Get user's own stories
router.get("/user", getUserStories);

// Get stories for user's family circle
router.get("/family-circle", getFamilyCircleStories);

// Get stories for a specific family (deprecated/alternative route)
router.get("/family/:familyId", getStoriesForFamily);

// Get a specific story by ID
router.get("/:storyId", getStoryById);

// Update a specific story
router.put("/:storyId", updateStory);
router.patch("/:storyId", updateStory);

// Delete a specific story
router.delete("/:storyId", deleteStory);

export default router;
