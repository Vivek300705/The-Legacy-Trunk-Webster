import Family from "../models/FamilyCircle.model.js";
import User from "../models/User.model.js";
import Invitation from "../models/Invitation.model.js";
import crypto from "crypto";
import { sendInvitationEmail } from ".././utils/sendInvitationEmail.js";

/* ---------------------------
   Create Family Circle
---------------------------- */
export const createFamilyCircle = async (req, res) => {
  const { name } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ message: "Family circle name is required" });
    }

    if (user.familyCircle) {
      return res.status(400).json({
        message:
          "You are already in a family circle. Please leave your current circle first.",
        currentCircleId: user.familyCircle,
      });
    }

    const newFamily = new Family({
      name: name.trim(),
      admin: user._id,
      member: [user._id], // MAKE SURE THIS IS HERE
    });

    await newFamily.save();

    user.familyCircle = newFamily._id;
    await user.save();

    const populatedFamily = await Family.findById(newFamily._id)
      .populate("admin", "name email profilePicture")
      .populate("member", "name email profilePicture");

    res.status(201).json(populatedFamily);
  } catch (error) {
    console.error("Error creating family circle:", error);
    res.status(500).json({
      message: "Error creating family circle",
      error: error.message,
    });
  }
};

/* ---------------------------
   Get Family Circle by ID
---------------------------- */
export const getFamilyCircle = async (req, res) => {
  const { circleId } = req.params;

  console.log("=== GET FAMILY CIRCLE REQUEST ===");
  console.log("Circle ID:", circleId);
  console.log("User:", req.user?._id);

  try {
    const family = await Family.findById(circleId)
      .populate("admin", "name email profilePicture")
      .populate("member", "name email profilePicture"); // THIS MUST BE "member" not "members"

    console.log("Found family:", family ? "Yes" : "No");

    if (!family) {
      return res.status(404).json({ message: "Family circle not found" });
    }

    // Check if user is a member
    const isMember = family.member.some(
      // THIS MUST BE "member" not "members"
      (m) => m._id.toString() === req.user._id.toString()
    );

    console.log("Is member:", isMember);

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this family circle",
      });
    }

    res.status(200).json(family);
  } catch (error) {
    console.error("Error fetching family circle:", error);
    res.status(500).json({
      message: "Error fetching family circle",
      error: error.message,
    });
  }
};

/* ---------------------------
   Get Family Members
---------------------------- */
export const getFamilyMembers = async (req, res) => {
  const { circleId } = req.params;

  try {
    const family = await Family.findById(circleId).populate(
      "member", // Changed from members to member
      "name email profilePicture"
    );

    if (!family) {
      return res.status(404).json({ message: "Family circle not found" });
    }

    const isMember = family.member.some(
      // Changed from members to member
      (member) => member._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this family circle",
      });
    }

    res.status(200).json(family.member); // Changed from members to member
  } catch (error) {
    console.error("Error fetching family members:", error);
    res.status(500).json({
      message: "Error fetching members",
      error: error.message,
    });
  }
};

/* ---------------------------
   Invite Member (with Pending Invitations)
---------------------------- */
export const inviteMember = async (req, res) => {
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║     INVITE MEMBER REQUEST RECEIVED     ║");
  console.log("╚════════════════════════════════════════╝");

  const { circleId } = req.params;
  const { email } = req.body;

  console.log("Circle ID:", circleId);
  console.log("Email to invite:", email);
  console.log("Requester ID:", req.user?._id);
  console.log("Requester Name:", req.user?.name);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:");

  try {
    console.log("\n[1/7] Finding family circle...");
    const family = await Family.findById(circleId);

    if (!family) {
      console.log("ERROR: Family circle not found");
      return res.status(404).json({ message: "Family circle not found" });
    }
    console.log("Found family:", family.name);

    console.log("\n[2/7] Checking admin permissions...");
    if (family.admin.toString() !== req.user._id.toString()) {
      console.log("ERROR: User is not admin");
      return res.status(403).json({ message: "Only admin can invite members" });
    }
    console.log("Admin check passed");

    const normalizedEmail = email.toLowerCase().trim();
    console.log("\n[3/7] Normalized email:", normalizedEmail);

    if (!normalizedEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    console.log("\n[4/7] Checking if user already exists...");
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      console.log("User exists in database:", existingUser._id);

      if (
        family.member.some((m) => m.toString() === existingUser._id.toString())
      ) {
        console.log("ERROR: User is already a member");
        return res.status(400).json({ message: "User is already a member" });
      }

      if (
        existingUser.familyCircle &&
        existingUser.familyCircle.toString() !== circleId
      ) {
        console.log("ERROR: User in another circle");
        return res.status(400).json({
          message: "User is already in another family circle",
        });
      }

      console.log("Adding existing user directly to family...");
      family.member.push(existingUser._id);
      await family.save();

      existingUser.familyCircle = family._id;
      await existingUser.save();

      const updatedFamily = await Family.findById(circleId)
        .populate("admin", "name email profilePicture")
        .populate("member", "name email profilePicture");

      console.log("User added successfully (no email needed)");
      return res.status(200).json({
        message: "Member added successfully",
        type: "direct",
        family: updatedFamily,
      });
    }

    console.log("User does not exist - need to send invitation");

    console.log("\n[5/7] Checking for existing invitations...");
    const existingInvitation = await Invitation.findOne({
      email: normalizedEmail,
      familyCircle: circleId,
      status: "pending",
    });

    if (existingInvitation) {
      console.log("ERROR: Invitation already exists");
      return res.status(400).json({
        message: "Invitation already sent to this email",
      });
    }
    console.log("No existing invitation found");

    console.log("\n[6/7] Creating new invitation...");
    const token = crypto.randomBytes(32).toString("hex");
    console.log("Generated token:", token);

    const invitation = new Invitation({
      email: normalizedEmail,
      familyCircle: circleId,
      invitedBy: req.user._id,
      token,
    });

    await invitation.save();
    console.log("Invitation saved to database, ID:", invitation._id);

    console.log("\n[7/7] Sending invitation email...");
    console.log("════════════════════════════════════════");

    try {
      await sendInvitationEmail(invitation, req.user.name, family.name);

      console.log("════════════════════════════════════════");
      console.log("EMAIL SENT SUCCESSFULLY!");
      console.log("════════════════════════════════════════\n");

      return res.status(200).json({
        message: "Invitation sent successfully",
        type: "invitation",
        invitation: {
          email: invitation.email,
          expiresAt: invitation.expiresAt,
          token: invitation.token,
        },
      });
    } catch (emailError) {
      console.log("════════════════════════════════════════");
      console.log("EMAIL SENDING FAILED!");
      console.log("════════════════════════════════════════");
      console.error("Error Name:", emailError.name);
      console.error("Error Message:", emailError.message);
      console.error("Error Stack:", emailError.stack);
      console.log("════════════════════════════════════════\n");

      // Delete the invitation since email failed
      await invitation.deleteOne();
      console.log("Invitation deleted from database due to email failure");

      return res.status(500).json({
        message: "Failed to send invitation email",
        error: emailError.message,
        details: "Please check server logs for more information",
      });
    }
  } catch (error) {
    console.log("\n════════════════════════════════════════");
    console.log("GENERAL ERROR IN INVITE MEMBER");
    console.log("════════════════════════════════════════");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    console.log("════════════════════════════════════════\n");

    res.status(500).json({
      message: "Error inviting member",
      error: error.message,
    });
  }
};
/* ---------------------------
   Get Circle Invitations
---------------------------- */
export const getCircleInvitations = async (req, res) => {
  const { circleId } = req.params;

  try {
    const family = await Family.findById(circleId);

    if (!family) {
      return res.status(404).json({ message: "Family circle not found" });
    }

    const isMember = family.member.some(
      // Changed from members to member
      (member) => member.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this family circle",
      });
    }

    const invitations = await Invitation.find({
      familyCircle: circleId,
      status: "pending",
      expiresAt: { $gt: new Date() },
    }).populate("invitedBy", "name email");

    res.status(200).json(invitations);
  } catch (error) {
    console.error("Error fetching invitations:", error);
    res.status(500).json({
      message: "Error fetching invitations",
      error: error.message,
    });
  }
};

/* ---------------------------
   Accept Invitation
---------------------------- */
export const acceptInvitation = async (req, res) => {
  const { token } = req.params;

  try {
    const invitation = await Invitation.findOne({
      token,
      status: "pending",
    }).populate("familyCircle");

    if (!invitation) {
      return res.status(404).json({
        message: "Invitation not found or already used",
      });
    }

    if (new Date() > invitation.expiresAt) {
      invitation.status = "expired";
      await invitation.save();
      return res.status(400).json({ message: "Invitation has expired" });
    }

    if (req.user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      return res.status(403).json({
        message: "This invitation is for a different email address",
      });
    }

    if (req.user.familyCircle) {
      return res.status(400).json({
        message:
          "You are already in a family circle. Leave it first to accept this invitation.",
      });
    }

    const family = await Family.findById(invitation.familyCircle);

    if (!family) {
      return res
        .status(404)
        .json({ message: "Family circle no longer exists" });
    }

    family.member.push(req.user._id); // Changed from members to member
    await family.save();

    const user = await User.findById(req.user._id);
    user.familyCircle = family._id;
    await user.save();

    invitation.status = "accepted";
    await invitation.save();

    const populatedFamily = await Family.findById(family._id)
      .populate("admin", "name email profilePicture")
      .populate("member", "name email profilePicture"); // Changed from members to member

    res.status(200).json({
      message: "Successfully joined family circle",
      family: populatedFamily,
    });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    res.status(500).json({
      message: "Error accepting invitation",
      error: error.message,
    });
  }
};

/* ---------------------------
   Remove Member
---------------------------- */
export const removeMember = async (req, res) => {
  const { circleId, memberId } = req.params;

  try {
    const family = await Family.findById(circleId);

    if (!family) {
      return res.status(404).json({ message: "Family circle not found" });
    }

    if (family.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admin can remove members" });
    }

    if (family.admin.toString() === memberId) {
      return res
        .status(400)
        .json({ message: "Cannot remove admin from the circle" });
    }

    family.member = family.member.filter(
      // Changed from members to member
      (member) => member.toString() !== memberId
    );
    await family.save();

    await User.findByIdAndUpdate(memberId, { familyCircle: null });

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Error removing member:", error);
    res.status(500).json({
      message: "Error removing member",
      error: error.message,
    });
  }
};

/* ---------------------------
   Leave Family Circle
---------------------------- */
export const leaveFamilyCircle = async (req, res) => {
  const { circleId } = req.params;

  try {
    const user = await User.findById(req.user._id);

    if (!user.familyCircle) {
      return res
        .status(400)
        .json({ message: "You are not in any family circle" });
    }

    const family = await Family.findById(user.familyCircle);

    if (!family) {
      user.familyCircle = null;
      await user.save();
      return res
        .status(200)
        .json({ message: "Family circle reference cleared" });
    }

    if (family.admin.toString() === user._id.toString()) {
      return res.status(400).json({
        message:
          "Admin cannot leave the circle. Delete the circle or transfer admin rights first.",
      });
    }

    family.member = family.member.filter(
      // Changed from members to member
      (member) => member.toString() !== user._id.toString()
    );
    await family.save();

    user.familyCircle = null;
    await user.save();

    res.status(200).json({ message: "Successfully left the family circle" });
  } catch (error) {
    console.error("Error leaving family circle:", error);
    res.status(500).json({
      message: "Error leaving family circle",
      error: error.message,
    });
  }
};

/* ---------------------------
   Delete Family Circle (Admin Only)
---------------------------- */
export const deleteFamilyCircle = async (req, res) => {
  const { circleId } = req.params;

  try {
    const family = await Family.findById(circleId);

    if (!family) {
      return res.status(404).json({ message: "Family circle not found" });
    }

    if (family.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only admin can delete the family circle",
      });
    }

    await User.updateMany(
      { _id: { $in: family.member } }, // Changed from members to member
      { familyCircle: null }
    );

    await Invitation.deleteMany({ familyCircle: circleId });

    await Family.findByIdAndDelete(circleId);

    res.status(200).json({ message: "Family circle deleted successfully" });
  } catch (error) {
    console.error("Error deleting family circle:", error);
    res.status(500).json({
      message: "Error deleting family circle",
      error: error.message,
    });
  }
};
export const updateCircleName = async (req, res) => {
  const { circleId } = req.params;
  const { name } = req.body;

  try {
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Circle name is required" });
    }

    const family = await Family.findById(circleId);

    if (!family) {
      return res.status(404).json({ message: "Family circle not found" });
    }

    // Check if user is admin
    if (family.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only admin can update circle name",
      });
    }

    family.name = name.trim();
    await family.save();

    const updatedFamily = await Family.findById(circleId)
      .populate("admin", "name email profilePicture")
      .populate("member", "name email profilePicture");

    res.status(200).json({
      message: "Circle name updated successfully",
      family: updatedFamily,
    });
  } catch (error) {
    console.error("Error updating circle name:", error);
    res.status(500).json({
      message: "Error updating circle name",
      error: error.message,
    });
  }
};
/* ---------------------------
   Cancel Invitation (Admin Only)
---------------------------- */
export const cancelInvitation = async (req, res) => {
  const { invitationId } = req.params;

  try {
    const invitation = await Invitation.findById(invitationId).populate('familyCircle');

    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    // Check if user is admin of the family circle
    const family = await Family.findById(invitation.familyCircle);
    
    if (!family) {
      return res.status(404).json({ message: "Family circle not found" });
    }

    if (family.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: "Only admin can cancel invitations" 
      });
    }

    // Delete the invitation
    await invitation.deleteOne();

    res.status(200).json({ 
      message: "Invitation cancelled successfully" 
    });
  } catch (error) {
    console.error("Error cancelling invitation:", error);
    res.status(500).json({
      message: "Error cancelling invitation",
      error: error.message,
    });
  }
};

export const getFamilyTreeData = async (req, res) => {
  try {
    const { circleId } = req.params;
    const userId = req.user._id;

    const circle = await FamilyCircle.findById(circleId)
      .populate("admin", "name email profilePicture")
      .populate("member", "name email profilePicture");

    if (!circle) {
      return res.status(404).json({ message: "Family circle not found" });
    }

    const isMember =
      circle.admin._id.toString() === userId.toString() ||
      circle.member.some((m) => m._id.toString() === userId.toString());

    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    const allMemberIds = [circle.admin._id, ...circle.member.map((m) => m._id)];

    // Get only admin-approved relationships
    const relationships = await Relationship.find({
      status: "approved",
      approvedByAdmin: true, // ✅ Only admin-approved
      $or: [
        { requester: { $in: allMemberIds } },
        { recipient: { $in: allMemberIds } },
      ],
    })
      .populate("requester", "name email profilePicture")
      .populate("recipient", "name email profilePicture");

    // Build tree structure
    const treeData = buildFamilyTree(circle, relationships);

    res.status(200).json({
      circle: {
        _id: circle._id,
        name: circle.name,
      },
      tree: treeData,
      members: [circle.admin, ...circle.member],
      relationships: relationships,
    });
  } catch (error) {
    console.error("Error fetching family tree:", error);
    res.status(500).json({
      message: "Error fetching family tree data",
      error: error.message,
    });
  }
};

function buildFamilyTree(circle, relationships) {
  const members = [circle.admin, ...circle.member];
  const nodes = members.map((member) => ({
    id: member._id.toString(),
    name: member.name,
    photo: member.profilePicture || "/default-avatar.jpg",
    email: member.email,
    isAdmin: member._id.toString() === circle.admin._id.toString(),
    children: [],
    parents: [],
    spouse: null,
    generation: 0,
  }));

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  relationships.forEach((rel) => {
    const requesterId = rel.requester._id.toString();
    const recipientId = rel.recipient._id.toString();
    const requesterNode = nodeMap.get(requesterId);
    const recipientNode = nodeMap.get(recipientId);

    if (!requesterNode || !recipientNode) return;

    const relType = rel.relationshipType;

    if (relType === "Parent") {
      requesterNode.children.push(recipientNode);
      recipientNode.parents.push(requesterNode);
    } else if (relType === "Child") {
      recipientNode.children.push(requesterNode);
      requesterNode.parents.push(recipientNode);
    } else if (relType === "Spouse") {
      requesterNode.spouse = recipientNode;
      recipientNode.spouse = requesterNode;
    } else if (relType === "Grandparent") {
      // Indirect: handle in UI
    }
  });

  // Find root (person with no parents)
  const roots = nodes.filter((n) => n.parents.length === 0);
  return roots.length > 0 ? roots[0] : nodes[0];
}