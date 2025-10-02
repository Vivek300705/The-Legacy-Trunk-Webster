import express from "express";
import {
  createStory,
  getStoriesForFamily,
  updateStory,
  deleteStory,
  getUserStories,
  getFamilyCircleStories,
} from "../controllers/storyController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// ⚠️ IMPORTANT: Specific routes MUST come before generic ones

// Get user's own stories
router.get("/user", getUserStories);

// Get stories for user's family circle
router.get("/family-circle", getFamilyCircleStories);

// Create a new story
router.post("/", createStory);

// Update a specific story
router.patch("/:storyId", updateStory);

// Delete a specific story
router.delete("/:storyId", deleteStory);

// Get stories for a specific family (by familyId) - MOVE TO END
router.get("/", getStoriesForFamily);

export default router;
