import User from "../models/User.model.js";

// Get user profile with populated family circle
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "familyCircle",
      populate: {
        path: "member admin",
        select: "name email profilePicture",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      _id: user._id,
      firebaseUID: user.firebaseUID,
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture,
      familyCircle: user.familyCircle,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, profilePicture } = req.body;
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(profilePicture && { profilePicture }),
      },
      { new: true, runValidators: true }
    ).populate({
      path: "familyCircle",
      populate: {
        path: "member admin",
        select: "name email profilePicture",
      },
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res
      .status(500)
      .json({ message: "Error updating user profile", error: error.message });
  }
};
