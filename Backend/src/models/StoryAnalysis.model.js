import mongoose from "mongoose";

const StoryAnalysisSchema = new mongoose.Schema(
  {
    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true,
      unique: true,
    },
    themes: {
      type: [String],
      default: [],
    },
    emotions: {
      type: [String],
      default: [],
    },
    timePeriod: {
      type: String,
      default: "unknown",
    },
    lifeStage: {
      type: String,
      default: "unknown",
    },
    locations: {
      type: [String],
      default: [],
    },
    keyEvents: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      default: "",
    },
    confidence: {
      type: String,
      enum: ["none", "low", "medium", "high"],
      default: "medium",
    },
    people: [
      {
        name: String,
        relationship: String,
      },
    ],
    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast searching
StoryAnalysisSchema.index({ storyId: 1 });
StoryAnalysisSchema.index({ themes: 1 });
StoryAnalysisSchema.index({ emotions: 1 });
StoryAnalysisSchema.index({ timePeriod: 1 });
StoryAnalysisSchema.index({ lifeStage: 1 });
StoryAnalysisSchema.index({ locations: 1 });

const StoryAnalysis = mongoose.model("StoryAnalysis", StoryAnalysisSchema);

export default StoryAnalysis;

// =================== MODEL METHODS ===================

export const StoryAnalysisModel = {
  // Get analysis by story ID
  async getByStoryId(storyId) {
    try {
      const analysis = await StoryAnalysis.findOne({ storyId });
      return analysis;
    } catch (error) {
      console.error("Error fetching analysis:", error);
      return null;
    }
  },

  // Save or update analysis
  async saveAnalysis(storyId, analysisData) {
    try {
      const analysis = await StoryAnalysis.findOneAndUpdate(
        { storyId },
        {
          themes: analysisData.themes || [],
          emotions: analysisData.emotions || [],
          timePeriod: analysisData.timePeriod || "unknown",
          lifeStage: analysisData.lifeStage || "unknown",
          locations: analysisData.locations || [],
          keyEvents: analysisData.keyEvents || [],
          summary: analysisData.summary || "",
          confidence: analysisData.confidence || "medium",
          people: analysisData.people || [],
          analyzedAt: new Date(),
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
      return analysis;
    } catch (error) {
      console.error("Error saving analysis:", error);
      throw error;
    }
  },

  // Search by tags
  async searchByTags(filters) {
    try {
      const query = {};

      if (filters.theme) {
        query.themes = filters.theme;
      }
      if (filters.emotion) {
        query.emotions = filters.emotion;
      }
      if (filters.timePeriod) {
        query.timePeriod = filters.timePeriod;
      }
      if (filters.lifeStage) {
        query.lifeStage = filters.lifeStage;
      }
      if (filters.location) {
        query.locations = filters.location;
      }

      const analyses = await StoryAnalysis.find(query)
        .populate("storyId")
        .limit(50);

      // Return stories with their analysis
      return analyses.map((analysis) => ({
        ...analysis.storyId.toObject(),
        analysis: {
          themes: analysis.themes,
          emotions: analysis.emotions,
          timePeriod: analysis.timePeriod,
          lifeStage: analysis.lifeStage,
          locations: analysis.locations,
          keyEvents: analysis.keyEvents,
          summary: analysis.summary,
          people: analysis.people,
        },
      }));
    } catch (error) {
      console.error("Error searching by tags:", error);
      return [];
    }
  },

  // Get all unique tags
  async getAllTags() {
    try {
      const result = await StoryAnalysis.aggregate([
        {
          $facet: {
            themes: [
              { $unwind: "$themes" },
              { $group: { _id: "$themes" } },
              { $sort: { _id: 1 } },
            ],
            emotions: [
              { $unwind: "$emotions" },
              { $group: { _id: "$emotions" } },
              { $sort: { _id: 1 } },
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
          },
        },
      ]);

      return {
        all_themes: result[0].themes.map((t) => t._id),
        all_emotions: result[0].emotions.map((e) => e._id),
        all_time_periods: result[0].timePeriods.map((tp) => tp._id),
        all_life_stages: result[0].lifeStages.map((ls) => ls._id),
      };
    } catch (error) {
      console.error("Error getting all tags:", error);
      return {
        all_themes: [],
        all_emotions: [],
        all_time_periods: [],
        all_life_stages: [],
      };
    }
  },
  async deleteByStoryId(storyId) {
    try {
      const result = await StoryAnalysis.deleteOne({ storyId });
      console.log(`🗑️ Deleted analysis for story ${storyId}`);
      return result;
    } catch (error) {
      console.error("Error deleting analysis:", error);
      throw error;
    }
  },
};
