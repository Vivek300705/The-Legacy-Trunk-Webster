import Story from "../models/Story.model.js";
import Media from "../models/Media.model.js"; // For cascading delete

// =================== CREATE STORY ===================
export const createStory = async (req, res) => {
  try {
    const { title, content, eventDate } = req.body;
    const userId = req.user._id;
    const userFamilyCircle = req.user.familyCircle;

    if (!userFamilyCircle) {
      return res.status(400).json({
        message: "You must be part of a family circle to create stories",
      });
    }

    const newStory = await Story.create({
      title,
      content,
      author: userId,
      familyCircle: userFamilyCircle,
      eventDate: eventDate || new Date(),
    });

    const populatedStory = await Story.findById(newStory._id)
      .populate("author", "name email profilePicture")
      .populate("familyCircle", "name");

    res.status(201).json(populatedStory);
  } catch (error) {
    console.error("Error creating story:", error);
    res
      .status(500)
      .json({ message: "Error creating story", error: error.message });
  }
};

// =================== GET USER STORIES ===================
export const getUserStories = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 10, skip = 0 } = req.query;

    const stories = await Story.find({ author: userId })
      .populate("author", "name email profilePicture")
      .populate("familyCircle", "name")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const totalStories = await Story.countDocuments({ author: userId });

    res.status(200).json({
      stories,
      total: totalStories,
      hasMore: skip + stories.length < totalStories,
    });
  } catch (error) {
    console.error("Error fetching user stories:", error);
    res
      .status(500)
      .json({ message: "Error fetching stories", error: error.message });
  }
};
export const getStoriesForFamily = async (req, res) => {
  try {
    const { familyId } = req.params;

    const stories = await Story.find({ family: familyId })
      .populate("author", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stories", error });
  }
};

// =================== GET STORY BY ID ===================
export const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const story = await Story.findById(id)
      .populate("author", "name email profilePicture")
      .populate("familyCircle", "name members");

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Check access (must belong to the same family circle)
    const userFamilyCircle = req.user.familyCircle?.toString();
    const storyFamilyCircle = story.familyCircle._id.toString();

    if (userFamilyCircle !== storyFamilyCircle) {
      return res
        .status(403)
        .json({ message: "You don't have access to this story" });
    }

    res.status(200).json(story);
  } catch (error) {
    console.error("Error fetching story:", error);
    res
      .status(500)
      .json({ message: "Error fetching story", error: error.message });
  }
};

// =================== GET STORIES FOR FAMILY CIRCLE ===================
export const getFamilyCircleStories = async (req, res) => {
  try {
    const userFamilyCircle = req.user.familyCircle;

    if (!userFamilyCircle) {
      return res
        .status(400)
        .json({ message: "User is not part of any family circle" });
    }

    const { limit = 20, skip = 0 } = req.query;

    const stories = await Story.find({ familyCircle: userFamilyCircle })
      .populate("author", "name email profilePicture")
      .sort({ eventDate: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const totalStories = await Story.countDocuments({
      familyCircle: userFamilyCircle,
    });

    res.status(200).json({
      stories,
      total: totalStories,
      hasMore: skip + stories.length < totalStories,
    });
  } catch (error) {
    console.error("Error fetching family circle stories:", error);
    res.status(500).json({
      message: "Error fetching family stories",
      error: error.message,
    });
  }
};

// =================== UPDATE STORY ===================
export const updateStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { title, content, eventDate } = req.body;
    const user = req.user;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: "Story not found." });
    }

    if (story.author.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this story." });
    }

    const updatedStory = await Story.findByIdAndUpdate(
      storyId,
      { title, content, eventDate },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedStory);
  } catch (error) {
    console.error("Error updating story:", error);
    res
      .status(500)
      .json({ message: "Error updating story", error: error.message });
  }
};

// =================== DELETE STORY ===================
export const deleteStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const user = req.user;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: "Story not found." });
    }

    if (story.author.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this story." });
    }

    await Story.findByIdAndDelete(storyId);

    // Cascade delete any media linked to this story
    await Media.deleteMany({ associatedStory: storyId });

    res
      .status(200)
      .json({ message: "Story and associated media deleted successfully." });
  } catch (error) {
    console.error("Error deleting story:", error);
    res
      .status(500)
      .json({ message: "Error deleting story", error: error.message });
  }
};
