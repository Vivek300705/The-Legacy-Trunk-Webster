/**
 * Configuration for AI Auto-Tagging System
 * Controls how stories are automatically analyzed and tagged
 */

export const AUTO_TAGGING_CONFIG = {
  // Enable/disable auto-tagging
  enabled: process.env.ENABLE_AUTO_TAGGING !== "false", // Default: enabled

  // When to trigger auto-analysis
  triggers: {
    onCreate: true, // Analyze when story is created
    onUpdate: false, // Re-analyze when story is updated (can be expensive)
    onMediaUpload: true, // Re-analyze when media is added
    manual: true, // Allow manual trigger by user
  },

  // Image analysis settings
  imageAnalysis: {
    enabled: true, // Enable image analysis with GPT-4 Vision
    maxImagesPerStory: 3, // Analyze up to 3 images per story (to control costs)
    imageDetail: "low", // "low" or "high" - affects API cost and detail level
    analyzeOnUpload: true, // Analyze images immediately after upload
    supportedFormats: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  },

  // Text analysis settings
  textAnalysis: {
    minContentLength: 50, // Minimum characters required for analysis
    includeTitle: true, // Include title in analysis
    includeDescriptions: true, // Include media descriptions
  },

  // AI Model settings
  model: {
    name: "gpt-4o-mini", // OpenAI model to use
    temperature: 0.3, // Lower = more consistent, Higher = more creative
    maxTokens: 1000, // Maximum tokens for response
    timeout: 30000, // 30 seconds timeout
  },

  // Queue settings
  queue: {
    delayMs: 1000, // Delay before processing (to batch updates)
    maxAttempts: 3, // Retry failed analyses
    backoffDelay: 2000, // Exponential backoff delay
  },

  // Tag extraction limits
  limits: {
    maxThemes: 3,
    maxEmotions: 3,
    maxLocations: 5,
    maxKeyEvents: 5,
    maxPeople: 10,
    summaryLength: 150,
  },

  // Confidence thresholds
  confidence: {
    minForDisplay: "low", // Minimum confidence to display tags
    requireManualReview: false, // Require manual review for low confidence
  },

  // Cost optimization
  optimization: {
    cacheResults: true, // Cache analysis results
    skipDuplicates: true, // Don't re-analyze identical content
    batchProcessing: false, // Process multiple stories in one request
  },

  // Privacy settings
  privacy: {
    shareWithFamily: true, // Share AI tags with family members
    allowOptOut: true, // Allow users to opt-out of auto-tagging
    storeRawResponse: false, // Don't store raw AI responses (for privacy)
  },
};

/**
 * Check if auto-tagging should be triggered for a story
 */
export function shouldTriggerAutoTagging(event, storyData) {
  if (!AUTO_TAGGING_CONFIG.enabled) {
    return false;
  }

  // Check if content is long enough
  const contentLength = (storyData.content || "").length;
  if (contentLength < AUTO_TAGGING_CONFIG.textAnalysis.minContentLength) {
    return false;
  }

  // Check trigger conditions
  switch (event) {
    case "create":
      return AUTO_TAGGING_CONFIG.triggers.onCreate;
    case "update":
      return AUTO_TAGGING_CONFIG.triggers.onUpdate;
    case "media_upload":
      return AUTO_TAGGING_CONFIG.triggers.onMediaUpload;
    case "manual":
      return AUTO_TAGGING_CONFIG.triggers.manual;
    default:
      return false;
  }
}

/**
 * Filter media items for analysis based on config
 */
export function filterMediaForAnalysis(mediaItems) {
  if (!AUTO_TAGGING_CONFIG.imageAnalysis.enabled || !mediaItems) {
    return [];
  }

  const supportedFormats = AUTO_TAGGING_CONFIG.imageAnalysis.supportedFormats;
  const maxImages = AUTO_TAGGING_CONFIG.imageAnalysis.maxImagesPerStory;

  return mediaItems
    .filter((m) => {
      const mimeType = m.mimeType || m.type;
      return (
        (m.type === "image" || supportedFormats.includes(mimeType)) &&
        (m.url || m.fileUrl)
      );
    })
    .slice(0, maxImages);
}

/**
 * Get AI model configuration
 */
export function getModelConfig() {
  return {
    model: AUTO_TAGGING_CONFIG.model.name,
    temperature: AUTO_TAGGING_CONFIG.model.temperature,
    max_tokens: AUTO_TAGGING_CONFIG.model.maxTokens,
  };
}

/**
 * Check if user has opted out of auto-tagging
 */
export function hasUserOptedOut(userId, userSettings) {
  if (!AUTO_TAGGING_CONFIG.privacy.allowOptOut) {
    return false;
  }

  return userSettings?.autoTagging?.disabled === true;
}

/**
 * Log auto-tagging event for monitoring
 */
export function logAutoTaggingEvent(event, data) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Auto-Tagging] ${event}:`, data);
  }
}

export default AUTO_TAGGING_CONFIG;
