import Family from "../models/FamilyCircle.model.js";
import User from "../models/User.model.js";

/* ---------------------------
   Create Family Circle
---------------------------- */
export const createFamilyCircle = async (req, res) => {
  const { name } = req.body;
  const user = req.user;

  try {
    if (user.familyCircle) {
      return res.status(400).json({ message: "User is already in a family." });
    }

    const newFamily = new Family({
      name,
      admin: user._id,
      members: [user._id],
    });
    await newFamily.save();

    await User.findByIdAndUpdate(user._id, { familyCircle: newFamily._id });

    res.status(201).json(newFamily);
  } catch (error) {
    res.status(500).json({ message: "Error creating family", error });
  }
};

/* ---------------------------
   Get Family Circle by ID
---------------------------- */
export const getFamilyCircle = async (req, res) => {
  const { circleId } = req.params;

  try {
    const family = await Family.findById(circleId)
      .populate("admin", "name email profilePicture")
      .populate("members", "name email profilePicture role");

    if (!family) {
      return res.status(404).json({ message: "Family circle not found" });
    }

    // Check if user is a member
    const isMember = family.members.some(
      (member) => member._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not a member of this family circle" });
    }

    res.status(200).json(family);
  } catch (error) {
    console.error("Error fetching family circle:", error);
    res
      .status(500)
      .json({ message: "Error fetching family circle", error: error.message });
  }
};

/* ---------------------------
   Get Family Members
---------------------------- */
export const getFamilyMembers = async (req, res) => {
  const { circleId } = req.params;

  try {
    const family = await Family.findById(circleId).populate(
      "members",
      "name email profilePicture role"
    );

    if (!family) {
      return res.status(404).json({ message: "Family circle not found" });
    }

    // Check if user is a member
    const isMember = family.members.some(
      (member) => member._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not a member of this family circle" });
    }

    res.status(200).json(family.members);
  } catch (error) {
    console.error("Error fetching family members:", error);
    res
      .status(500)
      .json({ message: "Error fetching members", error: error.message });
  }
};

/* ---------------------------
   Invite Member to Family Circle
---------------------------- */
export const inviteMember = async (req, res) => {
  const { circleId } = req.params;
  const { email } = req.body;

  try {
    const family = await Family.findById(circleId);

    if (!family) {
      return res.status(404).json({ message: "Family circle not found" });
    }

    // Check if user is admin
    if (family.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admin can invite members" });
    }

    // Find user by email
    const userToInvite = await User.findOne({ email });

    if (!userToInvite) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    // Check if user is already a member
    if (family.members.includes(userToInvite._id)) {
      return res.status(400).json({ message: "User is already a member" });
    }

    // Check if user is already in another family
    if (userToInvite.familyCircle) {
      return res
        .status(400)
        .json({ message: "User is already in another family circle" });
    }

    // Add user to family
    family.members.push(userToInvite._id);
    await family.save();

    // Update user's familyCircle
    userToInvite.familyCircle = family._id;
    await userToInvite.save();

    res.status(200).json({ message: "Member invited successfully", family });
  } catch (error) {
    console.error("Error inviting member:", error);
    res
      .status(500)
      .json({ message: "Error inviting member", error: error.message });
  }
};

/* ---------------------------
   Remove Member from Family Circle
---------------------------- */
export const removeMember = async (req, res) => {
  const { circleId, memberId } = req.params;

  try {
    const family = await Family.findById(circleId);

    if (!family) {
      return res.status(404).json({ message: "Family circle not found" });
    }

    // Check if user is admin
    if (family.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admin can remove members" });
    }

    // Cannot remove admin
    if (family.admin.toString() === memberId) {
      return res.status(400).json({ message: "Cannot remove admin" });
    }

    // Remove member from family
    family.members = family.members.filter(
      (member) => member.toString() !== memberId
    );
    await family.save();

    // Update user's familyCircle to null
    await User.findByIdAndUpdate(memberId, { familyCircle: null });

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Error removing member:", error);
    res
      .status(500)
      .json({ message: "Error removing member", error: error.message });
  }
};
