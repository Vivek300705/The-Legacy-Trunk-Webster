import express from "express";
import {
  createFamilyCircle,
  getFamilyCircle,
  getFamilyMembers,
  inviteMember,
  removeMember,
  acceptInvitation,
  getCircleInvitations,
  leaveFamilyCircle,
  deleteFamilyCircle,
  updateCircleName,
  cancelInvitation,
  getFamilyTreeData,
} from "../controllers/familyCircleController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// IMPORTANT: Put specific routes BEFORE parameterized routes

// Create family circle
router.post("/", createFamilyCircle);

// Accept invitation (specific route before /:circleId)
router.post("/accept-invite/:token", acceptInvitation);

// Cancel invitation (specific route before /:circleId)
router.delete("/invitations/:invitationId", cancelInvitation);

// Update circle name - FIXED
router.put("/:circleId", updateCircleName);

// Get family circle
router.get("/:circleId", getFamilyCircle);

// Get members
router.get("/:circleId/members", getFamilyMembers);

// Invite member
router.post("/:circleId/invite", inviteMember);

// Get invitations
router.get("/:circleId/invitations", getCircleInvitations);

// Leave circle
router.post("/:circleId/leave", leaveFamilyCircle);

// Remove member - THIS IS THE CRITICAL ONE FOR YOUR ISSUE
router.delete("/:circleId/members/:memberId", removeMember);

// Add before /:circleId routes
router.get("/:circleId/tree", getFamilyTreeData);

// Delete circle - Must be LAST
router.delete("/:circleId", deleteFamilyCircle);



export default router;
