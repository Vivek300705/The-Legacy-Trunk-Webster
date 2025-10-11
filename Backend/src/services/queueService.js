import Bull from "bull";
import { analyzeStory } from "./storyAnalyzer.js";
import StoryAnalysis from "../models/StoryAnalysis.model.js";

export const storyAnalysisQueue = new Bull("story-analysis", {
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
    tls: process.env.REDIS_URL?.startsWith("rediss://") ? {} : undefined,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});


// Process analysis jobs
storyAnalysisQueue.process(async (job) => {
  const { storyId, content, title, media } = job.data;

  console.log(`🔍 Starting AI analysis for story ${storyId}`);
  console.log(`📸 Media items: ${media?.length || 0}`);

  try {
    // Analyze the story using OpenAI (with text and images)
    const analysis = await analyzeStory(content, title, media);

    console.log("📊 Analysis result:", JSON.stringify(analysis, null, 2));

    // Check if we got valid analysis (not empty)
    const hasValidData =
      (analysis.themes && analysis.themes.length > 0) ||
      (analysis.emotions && analysis.emotions.length > 0) ||
      (analysis.timePeriod && analysis.timePeriod !== "unknown") ||
      (analysis.lifeStage && analysis.lifeStage !== "unknown");

    if (!hasValidData) {
      console.warn("⚠️ Analysis returned empty data, this shouldn't happen!");
    }

    // Save analysis to MongoDB - ALWAYS save even if empty
    const savedAnalysis = await StoryAnalysis.findOneAndUpdate(
      { storyId },
      {
        themes: analysis.themes || [],
        emotions: analysis.emotions || [],
        timePeriod: analysis.timePeriod || "unknown",
        lifeStage: analysis.lifeStage || "unknown",
        locations: analysis.locations || [],
        keyEvents: analysis.keyEvents || [],
        summary: analysis.summary || "",
        confidence: analysis.confidence || "medium",
        people: analysis.people || [],
        analyzedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    console.log(`✅ Successfully saved analysis for story ${storyId}`);
    console.log(`📋 Saved data:`, {
      themes: savedAnalysis.themes.length,
      emotions: savedAnalysis.emotions.length,
      timePeriod: savedAnalysis.timePeriod,
      lifeStage: savedAnalysis.lifeStage,
    });

    return { success: true, analysis: savedAnalysis };
  } catch (error) {
    console.error(`❌ Failed to analyze story ${storyId}:`, error);

    // Even on error, save a "failed" analysis record
    try {
      await StoryAnalysis.findOneAndUpdate(
        { storyId },
        {
          themes: [],
          emotions: [],
          timePeriod: "unknown",
          lifeStage: "unknown",
          locations: [],
          keyEvents: [],
          summary: "",
          confidence: "none",
          people: [],
          analyzedAt: new Date(),
        },
        {
          upsert: true,
          new: true,
        }
      );
      console.log(`📝 Saved empty analysis record for story ${storyId}`);
    } catch (saveError) {
      console.error(`❌ Failed to save empty analysis:`, saveError);
    }

    throw error;
  }
});

// Event handlers
storyAnalysisQueue.on("completed", (job, result) => {
  console.log(`✅ Analysis completed for story ${job.data.storyId}`);
});

storyAnalysisQueue.on("failed", (job, err) => {
  console.error(
    `❌ Analysis failed for story ${job.data.storyId}:`,
    err.message
  );
});

storyAnalysisQueue.on("error", (error) => {
  console.error("❌ Queue error:", error);
});

/**
 * Add story to analysis queue with media support
 */
export async function addStoryToAnalysisQueue(
  storyId,
  content,
  title,
  media = []
) {
  try {
    const job = await storyAnalysisQueue.add(
      {
        storyId,
        content,
        title,
        media,
      },
      {
        priority: 1,
        delay: 1000, // Wait 1 second before processing
      }
    );

    console.log(
      `📥 Story ${storyId} added to analysis queue (Job ID: ${job.id}) with ${
        media?.length || 0
      } media items`
    );
    return job;
  } catch (error) {
    console.error(`Failed to add story ${storyId} to queue:`, error);
    throw error;
  }
}

export default storyAnalysisQueue;
