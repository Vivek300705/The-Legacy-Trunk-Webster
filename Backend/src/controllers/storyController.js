import Story from "../models/Story.model.js";
import Media from "../models/Media.model.js";
<<<<<<< HEAD
import { addStoryToAnalysisQueue } from "../services/queueService.js";
import { shouldTriggerAutoTagging } from "../config/autoTaggingConfig.js";
=======
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6

// =================== CREATE STORY ===================
export const createStory = async (req, res) => {
  try {
<<<<<<< HEAD
    const { title, content, eventDate, tags } = req.body;
    const userId = req.user._id;
    const userFamilyCircle = req.user.familyCircle;

    if (!userFamilyCircle) {
=======
    // 👇 1. Add 'tags' back to the fields read from the body
    const { title, content, eventDate, tags } = req.body;
    const user = req.user;

    if (!user.familyCircle) {
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
      return res.status(400).json({
        message: "You must be part of a family circle to create stories",
      });
    }

<<<<<<< HEAD
    const newStory = await Story.create({
      title,
      content,
      author: userId,
      familyCircle: userFamilyCircle,
      eventDate: eventDate || new Date(),
      tags: tags || [],
    });

    const populatedStory = await Story.findById(newStory._id)
      .populate("author", "name email profilePicture")
      .populate("familyCircle", "name");

    // ✨ NEW: Trigger AI auto-tagging
    if (shouldTriggerAutoTagging("create", { content })) {
      console.log("📝 Auto-tagging enabled for story:", newStory._id);

      // Queue the analysis (don't wait for it)
      addStoryToAnalysisQueue(
        newStory._id.toString(),
        content,
        title,
        [] // No media yet, will be added after upload
      ).catch((err) => {
        console.error("Failed to queue AI analysis:", err);
        // Don't fail the request if queuing fails
      });
    }
=======
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
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6

    res.status(201).json(populatedStory);
  } catch (error) {
    console.error("Error creating story:", error);
<<<<<<< HEAD
    res.status(500).json({
      message: "Error creating story",
      error: error.message,
    });
=======
    res
      .status(500)
      .json({ message: "Error creating story", error: error.message });
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
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
<<<<<<< HEAD
    res.status(500).json({
      message: "Error fetching stories",
      error: error.message,
    });
=======
    res
      .status(500)
      .json({ message: "Error fetching stories", error: error.message });
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
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
<<<<<<< HEAD
      return res.status(403).json({
        message: "You don't have access to this story",
      });
=======
      return res
        .status(403)
        .json({ message: "You don't have access to this story" });
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
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
<<<<<<< HEAD
    res.status(500).json({
      message: "Error fetching story",
      error: error.message,
    });
=======
    res
      .status(500)
      .json({ message: "Error fetching story", error: error.message });
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
  }
};

// =================== GET STORIES FOR FAMILY CIRCLE ===================
export const getFamilyCircleStories = async (req, res) => {
  try {
    const userFamilyCircle = req.user.familyCircle;

    if (!userFamilyCircle) {
<<<<<<< HEAD
      return res.status(400).json({
        message: "User is not part of any family circle",
      });
=======
      return res
        .status(400)
        .json({ message: "User is not part of any family circle" });
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
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
<<<<<<< HEAD
      return res.status(403).json({
        message: "You are not authorized to edit this story.",
      });
=======
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this story." });
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
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

<<<<<<< HEAD
    // ✨ NEW: Re-trigger AI analysis if content changed significantly
    if (content && shouldTriggerAutoTagging("update", { content })) {
      console.log("📝 Re-analyzing updated story:", storyId);

      const media = await Media.find({ associatedStory: storyId });

      addStoryToAnalysisQueue(
        storyId,
        content,
        title,
        media.map((m) => ({
          url: m.fileUrl || m.url,
          type: m.type,
          mimeType: m.mimeType,
          description: m.description,
        }))
      ).catch((err) => {
        console.error("Failed to queue AI re-analysis:", err);
      });
    }

=======
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
    // Fetch associated media
    const media = await Media.find({ associatedStory: storyId });

    const storyWithMedia = {
      ...updatedStory.toObject(),
      media,
    };

    res.status(200).json(storyWithMedia);
  } catch (error) {
    console.error("Error updating story:", error);
<<<<<<< HEAD
    res.status(500).json({
      message: "Error updating story",
      error: error.message,
    });
=======
    res
      .status(500)
      .json({ message: "Error updating story", error: error.message });
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
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
<<<<<<< HEAD
      return res.status(403).json({
        message: "You are not authorized to delete this story.",
      });
=======
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this story." });
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
    }

    // First, get all media to delete from Cloudinary if needed
    const mediaFiles = await Media.find({ associatedStory: storyId });

    // Delete story
    await Story.findByIdAndDelete(storyId);

    // Cascade delete any media linked to this story
    await Media.deleteMany({ associatedStory: storyId });

<<<<<<< HEAD
    // ✨ NEW: Delete associated AI analysis
    const StoryAnalysis = (await import("../models/StoryAnalysis.model.js"))
      .default;
    await StoryAnalysis.deleteOne({ storyId });
    console.log("🗑️ Deleted AI analysis for story:", storyId);

=======
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
    res.status(200).json({
      message: "Story and associated media deleted successfully.",
      deletedMediaCount: mediaFiles.length,
    });
  } catch (error) {
    console.error("Error deleting story:", error);
<<<<<<< HEAD
    res.status(500).json({
      message: "Error deleting story",
      error: error.message,
    });
  }
};
// =================== SEARCH STORIES BY TAGS (AI) ===================
export const searchStoriesByTags = async (req, res) => {
  try {
    const { theme, emotion, timePeriod, lifeStage, location } = req.query;
    const userFamilyCircle = req.user.familyCircle;

    if (!userFamilyCircle) {
      return res.status(400).json({
        message: "User is not part of any family circle",
      });
    }

    console.log("🔍 Searching by AI tags:", { theme, emotion, timePeriod, lifeStage, location });

    // Import StoryAnalysis model
    const StoryAnalysis = (await import("../models/StoryAnalysis.model.js")).default;

    // Build query for AI analysis
    const query = {};
    if (theme) query.themes = theme;
    if (emotion) query.emotions = emotion;
    if (timePeriod) query.timePeriod = timePeriod;
    if (lifeStage) query.lifeStage = lifeStage;
    if (location) query.locations = location;

    console.log("📋 Analysis query:", query);

    // Find matching analyses
    const analyses = await StoryAnalysis.find(query).lean();
    console.log(`📊 Found ${analyses.length} matching analyses`);

    if (analyses.length === 0) {
      return res.status(200).json([]);
    }

    // Get story IDs
    const storyIds = analyses.map(a => a.storyId);

    // Get stories that match AND are in user's family circle
    const stories = await Story.find({
      _id: { $in: storyIds },
      familyCircle: userFamilyCircle
    })
      .populate("author", "name email profilePicture")
      .sort({ createdAt: -1 })
      .lean();

    console.log(`📚 Found ${stories.length} stories in user's family`);

    // Get media for each story
    const storiesWithMedia = await Promise.all(
      stories.map(async (story) => {
        const media = await Media.find({ associatedStory: story._id }).lean();
        const analysis = analyses.find(a => a.storyId.toString() === story._id.toString());
        
        return {
          ...story,
          media,
          analysis: analysis ? {
            themes: analysis.themes,
            emotions: analysis.emotions,
            timePeriod: analysis.timePeriod,
            lifeStage: analysis.lifeStage,
            locations: analysis.locations,
            keyEvents: analysis.keyEvents,
            summary: analysis.summary,
            people: analysis.people,
          } : null
        };
      })
    );

    res.status(200).json(storiesWithMedia);
  } catch (error) {
    console.error("Error searching by AI tags:", error);
    res.status(500).json({
      message: "Error searching stories",
      error: error.message,
    });
  }
};

// =================== GET ALL AVAILABLE AI TAGS ===================
export const getAllTags = async (req, res) => {
  try {
    const userFamilyCircle = req.user.familyCircle;

    if (!userFamilyCircle) {
      return res.status(400).json({
        message: "User is not part of any family circle",
      });
    }

    // Import StoryAnalysis model
    const StoryAnalysis = (await import("../models/StoryAnalysis.model.js")).default;

    // Get all stories in user's family circle
    const familyStories = await Story.find({ 
      familyCircle: userFamilyCircle 
    }).select("_id");

    const storyIds = familyStories.map(s => s._id);

    // Aggregate tags only from user's family stories
    const result = await StoryAnalysis.aggregate([
      {
        $match: { storyId: { $in: storyIds } }
      },
      {
        $facet: {
          themes: [
            { $unwind: "$themes" },
            { $group: { _id: "$themes", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          emotions: [
            { $unwind: "$emotions" },
            { $group: { _id: "$emotions", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          timePeriods: [
            { $group: { _id: "$timePeriod" } },
            { $match: { _id: { $ne: "unknown" } } },
            { $sort: { _id: 1 } },
          ],
          lifeStages: [
            { $group: { _id: "$lifeStage" } },
            { $match: { _id: { $ne: "unknown" } } },
            { $sort: { _id: 1 } },
          ],
          locations: [
            { $unwind: "$locations" },
            { $group: { _id: "$locations", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 20 }
          ],
        },
      },
    ]);

    const response = {
      themes: result[0].themes.map((t) => t._id),
      emotions: result[0].emotions.map((e) => e._id),
      timePeriods: result[0].timePeriods.map((tp) => tp._id),
      lifeStages: result[0].lifeStages.map((ls) => ls._id),
      locations: result[0].locations.map((l) => l._id),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting all tags:", error);
    res.status(500).json({
      message: "Error fetching tags",
      error: error.message,
    });
  }
};
// =================== SEARCH STORIES BY TAGS (AI) ===================
// export const searchStoriesByTags = async (req, res) => {
//   try {
//     const { theme, emotion, timePeriod, lifeStage, location } = req.query;
//     const userFamilyCircle = req.user.familyCircle;

//     if (!userFamilyCircle) {
//       return res.status(400).json({
//         message: "User is not part of any family circle",
//       });
//     }

//     console.log("🔍 AI Search filters:", { theme, emotion, timePeriod, lifeStage, location });

//     // Import StoryAnalysis model dynamically
//     const StoryAnalysis = (await import("../models/StoryAnalysis.model.js")).default;

//     // Build query for StoryAnalysis
//     const query = {};
//     if (theme) query.themes = theme;
//     if (emotion) query.emotions = emotion;
//     if (timePeriod) query.timePeriod = timePeriod;
//     if (lifeStage) query.lifeStage = lifeStage;
//     if (location) query.locations = location;

//     console.log("📋 Analysis query:", query);

//     // Find matching analyses
//     const analyses = await StoryAnalysis.find(query).lean();
//     console.log(`📊 Found ${analyses.length} matching analyses`);

//     if (analyses.length === 0) {
//       return res.status(200).json([]);
//     }

//     // Get story IDs from analyses
//     const storyIds = analyses.map(a => a.storyId);

//     // Get stories that match AND are in user's family circle
//     const stories = await Story.find({
//       _id: { $in: storyIds },
//       familyCircle: userFamilyCircle
//     })
//       .populate("author", "name email profilePicture")
//       .sort({ createdAt: -1 })
//       .lean();

//     console.log(`📚 Found ${stories.length} stories in user's family`);

//     // Get media for each story and attach analysis
//     const storiesWithMedia = await Promise.all(
//       stories.map(async (story) => {
//         const media = await Media.find({ associatedStory: story._id }).lean();
//         const analysis = analyses.find(a => a.storyId.toString() === story._id.toString());
        
//         return {
//           ...story,
//           media,
//           analysis: analysis ? {
//             themes: analysis.themes,
//             emotions: analysis.emotions,
//             timePeriod: analysis.timePeriod,
//             lifeStage: analysis.lifeStage,
//             locations: analysis.locations,
//             keyEvents: analysis.keyEvents,
//             summary: analysis.summary,
//             people: analysis.people,
//             confidence: analysis.confidence,
//             analyzedAt: analysis.analyzedAt,
//           } : null
//         };
//       })
//     );

//     res.status(200).json(storiesWithMedia);
//   } catch (error) {
//     console.error("❌ Error searching by AI tags:", error);
//     res.status(500).json({
//       message: "Error searching stories by tags",
//       error: error.message,
//     });
//   }
// };

// =================== GET ALL AVAILABLE AI TAGS ===================
// export const getAllTags = async (req, res) => {
//   try {
//     const userFamilyCircle = req.user.familyCircle;

//     if (!userFamilyCircle) {
//       return res.status(400).json({
//         message: "User is not part of any family circle",
//       });
//     }

//     console.log("🏷️ Getting all AI tags for family circle:", userFamilyCircle);

//     // Import StoryAnalysis model dynamically
//     const StoryAnalysis = (await import("../models/StoryAnalysis.model.js")).default;

//     // Get all stories in user's family circle
//     const familyStories = await Story.find({ 
//       familyCircle: userFamilyCircle 
//     }).select("_id");

//     const storyIds = familyStories.map(s => s._id);

//     console.log(`📚 Found ${storyIds.length} stories in family circle`);

//     // Aggregate tags only from user's family stories
//     const result = await StoryAnalysis.aggregate([
//       {
//         $match: { storyId: { $in: storyIds } }
//       },
//       {
//         $facet: {
//           themes: [
//             { $unwind: "$themes" },
//             { $group: { _id: "$themes", count: { $sum: 1 } } },
//             { $sort: { count: -1 } },
//           ],
//           emotions: [
//             { $unwind: "$emotions" },
//             { $group: { _id: "$emotions", count: { $sum: 1 } } },
//             { $sort: { count: -1 } },
//           ],
//           timePeriods: [
//             { $group: { _id: "$timePeriod" } },
//             { $match: { _id: { $ne: "unknown" } } },
//             { $sort: { _id: 1 } },
//           ],
//           lifeStages: [
//             { $group: { _id: "$lifeStage" } },
//             { $match: { _id: { $ne: "unknown" } } },
//             { $sort: { _id: 1 } },
//           ],
//           locations: [
//             { $unwind: "$locations" },
//             { $group: { _id: "$locations", count: { $sum: 1 } } },
//             { $sort: { count: -1 } },
//             { $limit: 20 }
//           ],
//         },
//       },
//     ]);

//     const response = {
//       themes: result[0]?.themes?.map((t) => t._id) || [],
//       emotions: result[0]?.emotions?.map((e) => e._id) || [],
//       timePeriods: result[0]?.timePeriods?.map((tp) => tp._id) || [],
//       lifeStages: result[0]?.lifeStages?.map((ls) => ls._id) || [],
//       locations: result[0]?.locations?.map((l) => l._id) || [],
//     };

//     console.log("✅ Returning tags:", {
//       themes: response.themes.length,
//       emotions: response.emotions.length,
//       timePeriods: response.timePeriods.length,
//       lifeStages: response.lifeStages.length,
//       locations: response.locations.length,
//     });

//     res.status(200).json(response);
//   } catch (error) {
//     console.error("❌ Error getting all tags:", error);
//     res.status(500).json({
//       message: "Error fetching AI tags",
//       error: error.message,
//     });
//   }
// };
=======
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
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
