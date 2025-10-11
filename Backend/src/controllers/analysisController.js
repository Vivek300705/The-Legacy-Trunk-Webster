import Story from "../models/Story.model.js";
import StoryAnalysis from "../models/StoryAnalysis.model.js";
import Media from "../models/Media.model.js";
import { addStoryToAnalysisQueue } from "../services/queueService.js";

// =================== GET STORY ANALYSIS ===================
export const getStoryAnalysis = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user._id;

    // Check if story exists and user has access
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Check if user belongs to the same family circle
    if (story.familyCircle.toString() !== req.user.familyCircle?.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get analysis
    const analysis = await StoryAnalysis.findOne({ storyId });

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found",
        status: "not_analyzed",
      });
    }

    res.status(200).json({
      ...analysis.toObject(),
      status: "completed",
    });
  } catch (error) {
    console.error("Error fetching analysis:", error);
    res.status(500).json({
      message: "Error fetching analysis",
      error: error.message,
    });
  }
};

// =================== TRIGGER STORY ANALYSIS ===================
export const triggerStoryAnalysis = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user._id;

    console.log(`📊 Triggering analysis for story: ${storyId}`);

    // Check if story exists and user has access
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Check if user belongs to the same family circle
    if (story.familyCircle.toString() !== req.user.familyCircle?.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get media associated with story
    const media = await Media.find({ associatedStory: storyId });
    console.log(`📸 Found ${media.length} media items`);

    // Prepare media data for analysis
    const mediaData = media.map((m) => ({
      url: m.fileUrl || m.url,
      type: m.type,
      mimeType: m.mimeType,
      description: m.description || "",
    }));

    // Add to analysis queue
    const job = await addStoryToAnalysisQueue(
      storyId,
      story.content,
      story.title,
      mediaData
    );

    console.log(`✅ Analysis job queued: ${job.id}`);

    // Return immediate response
    res.status(202).json({
      message: "Analysis started",
      status: "processing",
      jobId: job.id,
      estimatedTime: "5-10 seconds",
    });
  } catch (error) {
    console.error("Error triggering analysis:", error);
    res.status(500).json({
      message: "Error triggering analysis",
      error: error.message,
    });
  }
};

// =================== GET ALL AI TAGS ===================
export const getAllAITags = async (req, res) => {
  try {
    const userFamilyCircle = req.user.familyCircle;

    if (!userFamilyCircle) {
      return res.status(400).json({
        message: "User is not part of any family circle",
      });
    }

    console.log("🏷️ Getting all AI tags for family circle:", userFamilyCircle);

    // Get all stories in user's family circle
    const familyStories = await Story.find({
      familyCircle: userFamilyCircle,
    }).select("_id");

    const storyIds = familyStories.map((s) => s._id);

    console.log(`📚 Found ${storyIds.length} stories in family circle`);

    // Aggregate tags only from user's family stories
    const result = await StoryAnalysis.aggregate([
      {
        $match: { storyId: { $in: storyIds } },
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
            { $limit: 20 },
          ],
        },
      },
    ]);

    const response = {
      themes: result[0]?.themes?.map((t) => t._id) || [],
      emotions: result[0]?.emotions?.map((e) => e._id) || [],
      timePeriods: result[0]?.timePeriods?.map((tp) => tp._id) || [],
      lifeStages: result[0]?.lifeStages?.map((ls) => ls._id) || [],
      locations: result[0]?.locations?.map((l) => l._id) || [],
    };

    console.log("✅ Returning tags:", {
      themes: response.themes.length,
      emotions: response.emotions.length,
      timePeriods: response.timePeriods.length,
      lifeStages: response.lifeStages.length,
      locations: response.locations.length,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Error getting all tags:", error);
    res.status(500).json({
      message: "Error fetching AI tags",
      error: error.message,
    });
  }
};

// =================== SEARCH STORIES BY AI TAGS ===================
export const searchStoriesByAITags = async (req, res) => {
  try {
    const { theme, emotion, timePeriod, lifeStage, location } = req.query;
    const userFamilyCircle = req.user.familyCircle;

    if (!userFamilyCircle) {
      return res.status(400).json({
        message: "User is not part of any family circle",
      });
    }

    console.log("🔍 Searching by AI tags:", {
      theme,
      emotion,
      timePeriod,
      lifeStage,
      location,
    });

    // Build query for StoryAnalysis
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

    // Get story IDs from analyses
    const storyIds = analyses.map((a) => a.storyId);

    // Get stories that match AND are in user's family circle
    const stories = await Story.find({
      _id: { $in: storyIds },
      familyCircle: userFamilyCircle,
    })
      .populate("author", "name email profilePicture")
      .sort({ createdAt: -1 })
      .lean();

    console.log(`📚 Found ${stories.length} stories in user's family`);

    // Get media for each story and attach analysis
    const storiesWithMedia = await Promise.all(
      stories.map(async (story) => {
        const media = await Media.find({ associatedStory: story._id }).lean();
        const analysis = analyses.find(
          (a) => a.storyId.toString() === story._id.toString()
        );

        return {
          ...story,
          media,
          analysis: analysis
            ? {
                themes: analysis.themes,
                emotions: analysis.emotions,
                timePeriod: analysis.timePeriod,
                lifeStage: analysis.lifeStage,
                locations: analysis.locations,
                keyEvents: analysis.keyEvents,
                summary: analysis.summary,
                people: analysis.people,
                confidence: analysis.confidence,
                analyzedAt: analysis.analyzedAt,
              }
            : null,
        };
      })
    );

    res.status(200).json(storiesWithMedia);
  } catch (error) {
    console.error("❌ Error searching by AI tags:", error);
    res.status(500).json({
      message: "Error searching stories by tags",
      error: error.message,
    });
  }
};
