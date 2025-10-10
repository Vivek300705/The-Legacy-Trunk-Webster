import express from "express";
import {
  createStory,
  getStoriesForFamily,
  updateStory,
  deleteStory,
  getUserStories,
  getFamilyCircleStories,
  getStoryById,
<<<<<<< HEAD
  searchStoriesByTags,
  getAllTags,
  // forceAnalyzeStory,
=======
  getUniqueTagsForFamily
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
} from "../controllers/storyController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

<<<<<<< HEAD
// ⭐ CRITICAL: Specific routes MUST come BEFORE parameterized routes!
=======
// ✅ IMPORTANT: Specific routes MUST come before generic/parameterized ones
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6

// Create a new story
router.post("/", createStory);

<<<<<<< HEAD
// ✅ AI SEARCH ROUTES - MUST BE FIRST (before /:storyId)
router.get("/tags", getAllTags); // GET /stories/tags
router.get("/search-by-tags", searchStoriesByTags); // GET /stories/search-by-tags

=======
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
// Get user's own stories
router.get("/user", getUserStories);

// Get stories for user's family circle
router.get("/family-circle", getFamilyCircleStories);

<<<<<<< HEAD
// Get stories for a specific family
router.get("/family/:familyId", getStoriesForFamily);

// ⚠️ PARAMETERIZED ROUTES COME LAST
// Get a specific story by ID (MUST be after specific routes!)
=======
// Get stories for a specific family (deprecated/alternative route)
router.get("/family/:familyId", getStoriesForFamily);

// Get a specific story by ID
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
router.get("/:storyId", getStoryById);

// Update a specific story
router.put("/:storyId", updateStory);
router.patch("/:storyId", updateStory);

// Delete a specific story
router.delete("/:storyId", deleteStory);

<<<<<<< HEAD
=======
router.get('/tags/unique', authMiddleware, getUniqueTagsForFamily);

>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
export default router;
