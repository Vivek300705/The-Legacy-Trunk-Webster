import express from "express";
import { searchContent } from "../controllers/searchController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Test route (no auth required)
router.get("/test", (req, res) => {
  res.json({
    message: "Search routes are working!",
    timestamp: new Date().toISOString(),
  });
});

// All other search routes require authentication
router.use(authMiddleware);

// Search content
router.get("/", searchContent);

export default router;
