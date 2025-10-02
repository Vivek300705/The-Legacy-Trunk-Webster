import express from "express";
import {
  sendRequest,
  getPendingRequests,
  respondToRequest,
  getUserRelationships, // Add this import
} from "../controllers/relationshipController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// All relationship routes are protected and require a logged-in user
router.use(authMiddleware);

// Get all approved relationships for the logged-in user
router.get("/approved", getUserRelationships);

// Send a new relationship request
router.post("/", sendRequest);

// Get all of your pending incoming requests
router.get("/pending", getPendingRequests);

// Respond to a specific request (approve/reject)
router.put("/:requestId", respondToRequest);

export default router;
