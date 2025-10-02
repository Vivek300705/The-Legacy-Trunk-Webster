import express from "express";
import {
  createFamilyCircle,
  getFamilyCircle,
  getFamilyMembers,
  inviteMember,
  removeMember,
} from "../controllers/familyCircleController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create a new family circle
router.post("/", createFamilyCircle);

// Get specific family circle details
router.get("/:circleId", getFamilyCircle);

// Get members of a specific family circle
router.get("/:circleId/members", getFamilyMembers);

// Invite a member to family circle
router.post("/:circleId/invite", inviteMember);

// Remove a member from family circle
router.delete("/:circleId/members/:memberId", removeMember);

export default router;
