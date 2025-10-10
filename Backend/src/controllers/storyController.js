import Story from "../models/Story.model.js";
import Media from "../models/Media.model.js";

// =================== CREATE STORY ===================
export const createStory = async (req, res) => {
  try {
    // 👇 1. Add 'tags' back to the fields read from the body
    const { title, content, eventDate, tags } = req.body;
    const user = req.user;

    if (!user.familyCircle) {
      return res.status(400).json({
        message: "You must be part of a family circle to create stories",
      });
    }

    const newStory = new Story({
      title,
      content,
      author: user._id,
      familyCircle: user.familyCircle,
      eventDate: eventDate || new Date(),
      tags: tags || [], // 👇 2. Save the provided tags, or an empty array
    });

    await newStory.save();

    const populatedStory = await Story.findById(newStory._id)
      .populate("author", "name email profilePicture");

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

    // Fetch media for each story
    const storiesWithMedia = await Promise.all(
      stories.map(async (story) => {
        const media = await Media.find({ associatedStory: story._id });
        return {
          ...story.toObject(),
          media,
        };
      })
    );

    const totalStories = await Story.countDocuments({ author: userId });

    res.status(200).json({
      stories: storiesWithMedia,
      total: totalStories,
      hasMore: parseInt(skip) + stories.length < totalStories,
    });
  } catch (error) {
    console.error("Error fetching user stories:", error);
    res
      .status(500)
      .json({ message: "Error fetching stories", error: error.message });
  }
};

// =================== GET STORIES FOR FAMILY ===================
export const getStoriesForFamily = async (req, res) => {
  try {
    const { familyId } = req.params;

    const stories = await Story.find({ familyCircle: familyId })
      .populate("author", "name profilePicture")
      .sort({ createdAt: -1 });

    // Fetch media for each story
    const storiesWithMedia = await Promise.all(
      stories.map(async (story) => {
        const media = await Media.find({ associatedStory: story._id });
        return {
          ...story.toObject(),
          media,
        };
      })
    );

    res.status(200).json(storiesWithMedia);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stories", error });
  }
};

// =================== GET STORY BY ID ===================
export const getStoryById = async (req, res) => {
  try {
    const { storyId } = req.params;

    const story = await Story.findById(storyId)
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

    // Fetch associated media
    const media = await Media.find({ associatedStory: storyId }).populate(
      "uploader",
      "name profilePicture"
    );

    const storyWithMedia = {
      ...story.toObject(),
      media,
    };

    res.status(200).json(storyWithMedia);
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

    // Fetch media for each story
    const storiesWithMedia = await Promise.all(
      stories.map(async (story) => {
        const media = await Media.find({ associatedStory: story._id });
        return {
          ...story.toObject(),
          media,
        };
      })
    );

    const totalStories = await Story.countDocuments({
      familyCircle: userFamilyCircle,
    });

    res.status(200).json({
      stories: storiesWithMedia,
      total: totalStories,
      hasMore: parseInt(skip) + stories.length < totalStories,
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
    const { title, content, eventDate, tags } = req.body;
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

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (eventDate !== undefined) updateData.eventDate = eventDate;
    if (tags !== undefined) updateData.tags = tags;

    const updatedStory = await Story.findByIdAndUpdate(storyId, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("author", "name email profilePicture")
      .populate("familyCircle", "name");

    // Fetch associated media
    const media = await Media.find({ associatedStory: storyId });

    const storyWithMedia = {
      ...updatedStory.toObject(),
      media,
    };

    res.status(200).json(storyWithMedia);
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

    // First, get all media to delete from Cloudinary if needed
    const mediaFiles = await Media.find({ associatedStory: storyId });

    // Delete story
    await Story.findByIdAndDelete(storyId);

    // Cascade delete any media linked to this story
    await Media.deleteMany({ associatedStory: storyId });

    res.status(200).json({
      message: "Story and associated media deleted successfully.",
      deletedMediaCount: mediaFiles.length,
    });
  } catch (error) {
    console.error("Error deleting story:", error);
    res
      .status(500)
      .json({ message: "Error deleting story", error: error.message });
  }
};
// Get unique tags for the family circle
export const getUniqueTagsForFamily = async (req, res) => {
  try {
    const user = req.user;
    if (!user.familyCircle) {
      return res.status(200).json([]); // No family, no tags
    }

    const uniqueTags = await Story.aggregate([
      // 1. Find all stories in the user's family circle
      { $match: { familyCircle: user.familyCircle } },
      
      // 2. Unwind the tags array (creates a doc for each tag)
      { $unwind: '$tags' },

      // 3. Group by the tag name to get unique tags
      { $group: { _id: '$tags' } },
      
      // 4. Sort the tags alphabetically
      { $sort: { _id: 1 } },

      // 5. Reshape the output
      { $project: { _id: 0, tag: '$_id' } }
    ]);

    res.status(200).json(uniqueTags.map(t => t.tag)); // Send back an array of strings
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tags', error });
  }
};
