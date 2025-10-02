import express from 'express';
// Import the new functions
import { createStory, getStoriesForFamily, updateStory, deleteStory } from '../controllers/storyController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes for creating and getting stories (already exist)
router.post('/', authMiddleware, createStory);
router.get('/', authMiddleware, getStoriesForFamily);

// 👇 Add these new routes for updating and deleting a specific story
// The ':storyId' is a URL parameter that tells us which story to target

// Example Frontend URL: PATCH /api/stories/633c5e8f12a4...
router.patch('/:storyId', authMiddleware, updateStory);

// Example Frontend URL: DELETE /api/stories/633c5e8f12a4...
router.delete('/:storyId', authMiddleware, deleteStory);


export default router;