import express from "express";
import {
  sendRequest,
  getPendingRequests,
  respondToRequest,
  getUserRelationships,
  getPendingRelationshipsForAdmin,
  adminApproveRelationship, // Add this import
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

// Add these routes
router.get("/admin/pending", getPendingRelationshipsForAdmin);
router.put("/admin/approve/:requestId", adminApproveRelationship);

export default router;
