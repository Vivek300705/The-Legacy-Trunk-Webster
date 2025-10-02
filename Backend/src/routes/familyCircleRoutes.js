import express from 'express';
import { createFamilyCircle } from '../controllers/familyCircleController.js';

// The path here must go up one level ('../') to get out of 'routes'
// and then go into 'middleware'. It must also end in '.js'.
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createFamilyCircle);

export default router;