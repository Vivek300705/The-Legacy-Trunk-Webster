import Bull from "bull";
import { analyzeStory } from "./storyAnalyzer.js";
import StoryAnalysis from "../models/StoryAnalysis.model.js";

// --- UPDATED REDIS CONNECTION ---
// This new connection logic checks for the live REDIS_URL from Render first,
// and falls back to localhost if it's not found.
export const storyAnalysisQueue = new Bull("story-analysis", process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000, // Increased delay for production
    },
    removeOnComplete: true,
    removeOnFail: 1000, // Keep failed jobs for a while
  },
});


// Process analysis jobs
storyAnalysisQueue.process(async (job) => {
  const { storyId, content, title, media } = job.data;

  console.log(`🔍 Starting AI analysis for story ${storyId}`);

  try {
    const analysis = await analyzeStory(content, title, media);
    console.log(`📊 Analysis result for story ${storyId}:`, analysis);

    // Save analysis to MongoDB
    const savedAnalysis = await StoryAnalysis.findOneAndUpdate(
      { storyId },
      { ...analysis, analyzedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Successfully saved analysis for story ${storyId}`);
    return { success: true, analysisId: savedAnalysis._id };
  } catch (error) {
    console.error(`❌ Failed to analyze story ${storyId}:`, error);
    // The job will be retried automatically based on backoff settings.
    // We throw the error to signal a failure.
    throw error;
  }
});

// --- Event Handlers for Better Logging ---
storyAnalysisQueue.on("completed", (job, result) => {
  console.log(`✅ Job ${job.id} (Story ${job.data.storyId}) completed successfully.`);
});

storyAnalysisQueue.on("failed", (job, err) => {
  console.error(
    `❌ Job ${job.id} (Story ${job.data.storyId}) failed after ${job.attemptsMade} attempts with error:`,
    err.message
  );
});

storyAnalysisQueue.on("error", (error) => {
  console.error("❌ A queue-level error occurred:", error);
});


/**
 * Add story to analysis queue with media support
 */
export async function addStoryToAnalysisQueue(storyId, content, title, media = []) {
  try {
    const job = await storyAnalysisQueue.add({
      storyId,
      content,
      title,
      media,
    });
    console.log(`📥 Story ${storyId} added to analysis queue (Job ID: ${job.id})`);
    return job;
  } catch (error) {
    console.error(`Failed to add story ${storyId} to queue:`, error);
    throw error;
  }
}

export default storyAnalysisQueue;
