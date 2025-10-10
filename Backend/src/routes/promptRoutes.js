import express from 'express';
import { getRandomPrompt } from '../controllers/promptController.js';

const router = express.Router();

// A user does not need to be logged in to see a prompt idea
router.get('/random', getRandomPrompt);

export default router;