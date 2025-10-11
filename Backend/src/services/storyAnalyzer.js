import { STORY_TAXONOMY } from "../config/taxonomy.js";

// Enable demo mode when OpenAI fails
const DEMO_MODE = process.env.DEMO_MODE === "true" || false;

/**
 * Analyze a story using OpenAI GPT with support for text and image analysis
 * Falls back to demo data if API fails
 */
export async function analyzeStory(
  storyText,
  storyTitle = "",
  mediaItems = []
) {
  // Check if API key exists
  if (
    !process.env.OPENAI_API_KEY ||
    process.env.OPENAI_API_KEY.includes("your-api-key")
  ) {
    console.warn("⚠️ OPENAI_API_KEY is not set! Using demo analysis...");
    return getDemoAnalysis(storyText, storyTitle);
  }

  // Try OpenAI analysis first
  try {
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Combine title and content
    let fullText = storyTitle
      ? `Title: ${storyTitle}\n\n${storyText}`
      : storyText;

    // Add media descriptions if available
    if (mediaItems && mediaItems.length > 0) {
      const mediaDescriptions = mediaItems
        .filter((m) => m.description && m.description.trim())
        .map((m, idx) => `Media ${idx + 1}: ${m.description}`)
        .join("\n");

      if (mediaDescriptions) {
        fullText += `\n\nMedia Descriptions:\n${mediaDescriptions}`;
      }
    }

    // Check if text is too short
    if (fullText.trim().length < 50) {
      console.log("Story too short for analysis, returning demo analysis");
      return getDemoAnalysis(storyText, storyTitle);
    }

    console.log(
      `Analyzing story: "${storyTitle}" (${fullText.length} characters, ${
        mediaItems?.length || 0
      } media items)`
    );

    const systemPrompt = `You are an expert at analyzing family stories and memories, including both text and images. 

Your task is to analyze the provided story content (text, images, and media descriptions) and extract:
1. Main themes (1-3 most relevant)
2. Emotions expressed (1-3 primary emotions)
3. Time period mentioned or implied (from text or visual clues in images)
4. Life stage being described
5. People mentioned (names and relationships if identifiable)
6. Locations mentioned (cities, countries, or places)
7. Key events or milestones
8. A brief one-sentence summary (max 150 characters)

Available themes: ${STORY_TAXONOMY.themes.join(", ")}
Available emotions: ${STORY_TAXONOMY.emotions.join(", ")}
Available time periods: ${STORY_TAXONOMY.timePeriods.join(", ")}
Available life stages: ${STORY_TAXONOMY.lifeStages.join(", ")}

When analyzing images:
- Look for visual clues about time period (clothing, vehicles, architecture, photo quality)
- Identify settings and locations visible in images
- Recognize activities and events depicted
- Note emotional expressions in photos
- Consider the overall context that images provide to the story

IMPORTANT: 
- Only use themes and emotions from the provided lists
- Be conservative with tags - quality over quantity
- If unclear about time period or life stage, use "unknown"
- Extract only clearly mentioned people and places
- Summary must be under 150 characters
- Combine insights from both text and images for a complete analysis

Return your analysis as valid JSON with this exact structure:
{
  "themes": ["theme1", "theme2"],
  "emotions": ["emotion1", "emotion2"],
  "timePeriod": "1960s",
  "lifeStage": "childhood",
  "people": [
    {"name": "John", "relationship": "father"}
  ],
  "locations": ["New York"],
  "keyEvents": ["event1", "event2"],
  "summary": "A brief one-sentence summary of the story"
}`;

    // Prepare messages array
    const messages = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this story:\n\n${fullText}`,
          },
        ],
      },
    ];

    // Add image analysis for image media items (if URLs are accessible)
    if (mediaItems && mediaItems.length > 0) {
      const imageItems = mediaItems.filter(
        (m) =>
          m.type === "image" || (m.mimeType && m.mimeType.startsWith("image/"))
      );

      // Add up to 3 images to the analysis (to stay within token limits)
      const imagesToAnalyze = imageItems.slice(0, 3);

      for (const img of imagesToAnalyze) {
        if (img.url || img.fileUrl) {
          messages[1].content.push({
            type: "image_url",
            image_url: {
              url: img.url || img.fileUrl,
              detail: "low", // Use "low" to save tokens
            },
          });
        }
      }

      if (imagesToAnalyze.length > 0) {
        console.log(`Including ${imagesToAnalyze.length} images in analysis`);
      }
    }

    // Call OpenAI API with vision support
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const analysisText = response.choices[0].message.content;
    console.log("Raw AI response:", analysisText);

    const analysis = JSON.parse(analysisText);
    const validatedAnalysis = validateAndCleanAnalysis(analysis);

    console.log("Validated analysis:", validatedAnalysis);
    return validatedAnalysis;
  } catch (error) {
    console.error("AI Analysis error:", error);

    // Check if it's a rate limit or quota error
    if (
      error.status === 429 ||
      error.code === "insufficient_quota" ||
      error.message?.includes("quota")
    ) {
      console.warn("⚠️ OpenAI quota exceeded! Returning demo analysis...");
      const demoResult = getDemoAnalysis(storyText, storyTitle);
      console.log("📊 Demo analysis generated:", demoResult);
      return demoResult;
    }

    // Log specific error details
    if (error.response) {
      console.error("OpenAI API Error:", error.response.data);
    } else if (error.message) {
      console.error("Error message:", error.message);
    }

    // Return demo analysis instead of empty
    console.warn("⚠️ AI failed, returning demo analysis...");
    const demoResult = getDemoAnalysis(storyText, storyTitle);
    console.log("📊 Demo analysis generated:", demoResult);
    return demoResult;
  }
}

/**
 * Generate smart demo analysis based on story content
 */
function getDemoAnalysis(storyText, storyTitle = "") {
  console.log("🎭 Generating demo analysis...");
  console.log("📝 Story title:", storyTitle);
  console.log("📝 Story text preview:", storyText.substring(0, 100));

  const text = `${storyTitle} ${storyText}`.toLowerCase();
  console.log("🔍 Combined text length:", text.length);

  // Smart theme detection (expanded keywords)
  const themes = [];
  if (text.match(/child|young|school|kid|youth|teenage/))
    themes.push("childhood");
  if (
    text.match(
      /family|parent|mother|father|grandma|grandmother|grandpa|grandfather|sibling|brother|sister/
    )
  )
    themes.push("family");
  if (text.match(/garden|cook|recipe|food|meal|kitchen|bake|dish/))
    themes.push("cooking");
  if (text.match(/travel|journey|trip|vacation|visit|tour/))
    themes.push("travel");
  if (text.match(/celebrate|party|birthday|wedding|anniversary|holiday/))
    themes.push("celebration");
  if (text.match(/war|military|soldier|army|service|veteran/))
    themes.push("military");
  if (text.match(/learn|teach|educate|study|lesson|teacher/))
    themes.push("education");
  if (text.match(/work|job|career|business|profession/)) themes.push("career");
  if (text.match(/music|sing|song|instrument|play|concert/))
    themes.push("music");
  if (text.match(/sport|game|play|team|compete|athletic/))
    themes.push("sports");
  if (text.match(/tradition|custom|ritual|heritage|culture|legacy/))
    themes.push("tradition");

  // Always add at least two themes
  if (themes.length === 0) themes.push("family", "tradition");
  if (themes.length === 1) themes.push("heritage");

  console.log("🎯 Detected themes:", themes);

  // Smart emotion detection (expanded keywords)
  const emotions = [];
  if (text.match(/happy|joy|delight|cheerful|glad|wonderful|beautiful|lovely/))
    emotions.push("joy");
  if (
    text.match(/remember|memory|past|recall|reminisce|nostalgic|miss|used to/)
  )
    emotions.push("nostalgia");
  if (text.match(/proud|achieve|success|accomplish|triumph/))
    emotions.push("pride");
  if (text.match(/sad|grief|sorrow|mourn|lost|miss|cry/))
    emotions.push("sadness");
  if (text.match(/hope|dream|future|wish|aspire|optimistic/))
    emotions.push("hope");
  if (text.match(/grateful|thank|appreciate|blessing|fortunate/))
    emotions.push("gratitude");
  if (text.match(/love|adore|cherish|treasure|dear|beloved/))
    emotions.push("love");
  if (text.match(/peace|calm|serene|tranquil|content/)) emotions.push("peace");
  if (text.match(/excite|thrill|eager|enthusiastic|adventure/))
    emotions.push("excitement");

  // Always add at least two emotions
  if (emotions.length === 0) emotions.push("nostalgia", "love");
  if (emotions.length === 1) emotions.push("gratitude");

  console.log("💖 Detected emotions:", emotions);

  // Smart time period detection (expanded)
  let timePeriod = "unknown";
  const decades = [
    "1920s",
    "1930s",
    "1940s",
    "1950s",
    "1960s",
    "1970s",
    "1980s",
    "1990s",
    "2000s",
    "2010s",
    "2020s",
  ];
  for (const decade of decades) {
    if (text.includes(decade) || text.includes(decade.slice(0, 3))) {
      timePeriod = decade;
      break;
    }
  }

  // Try to detect year ranges
  if (timePeriod === "unknown") {
    const yearMatch = text.match(/\b(19\d{2}|20\d{2})\b/);
    if (yearMatch) {
      const year = parseInt(yearMatch[1]);
      const decadeStart = Math.floor(year / 10) * 10;
      timePeriod = `${decadeStart}s`;
    }
  }

  console.log("📅 Detected time period:", timePeriod);

  // Smart life stage detection (expanded)
  let lifeStage = "unknown";
  if (text.match(/baby|infant|newborn/)) lifeStage = "infancy";
  else if (text.match(/child|young|kid|elementary|primary/))
    lifeStage = "childhood";
  else if (text.match(/teen|adolescent|high school|teenage/))
    lifeStage = "adolescence";
  else if (text.match(/college|university|twenty|twenties|young adult/))
    lifeStage = "young-adult";
  else if (text.match(/middle|forty|fifties|midlife/)) lifeStage = "middle-age";
  else if (text.match(/retire|elder|senior|elderly|old age/))
    lifeStage = "senior";
  else if (text.match(/generation|ancestor|descendant|grandchild/))
    lifeStage = "multi-generational";

  // If mentions grandmother/grandfather, likely multi-generational
  if (
    text.match(/grandma|grandmother|grandpa|grandfather/) &&
    lifeStage === "unknown"
  ) {
    lifeStage = "multi-generational";
  }

  console.log("👤 Detected life stage:", lifeStage);

  // Extract simple locations
  const locations = [];
  const commonPlaces = [
    "New York",
    "California",
    "Texas",
    "Boston",
    "Chicago",
    "India",
    "England",
    "Paris",
    "London",
    "Italy",
    "Spain",
    "Germany",
    "France",
    "China",
    "Japan",
    "Mexico",
    "Canada",
  ];
  for (const place of commonPlaces) {
    if (text.includes(place.toLowerCase())) {
      locations.push(place);
    }
  }

  console.log("📍 Detected locations:", locations);

  // Generate summary
  const summary = storyTitle
    ? storyTitle.length > 147
      ? `${storyTitle.substring(0, 147)}...`
      : storyTitle
    : storyText.length > 147
    ? storyText.substring(0, 147) + "..."
    : storyText;

  const result = {
    themes: themes.slice(0, 3),
    emotions: emotions.slice(0, 3),
    timePeriod,
    lifeStage,
    people: [],
    locations: locations.slice(0, 3),
    keyEvents: [],
    summary,
    analyzedAt: new Date().toISOString(),
    confidence: "demo", // Mark as demo data
  };

  console.log("✅ Demo analysis result:", JSON.stringify(result, null, 2));
  return result;
}

/**
 * Validate and clean the analysis result
 */
function validateAndCleanAnalysis(analysis) {
  return {
    themes: Array.isArray(analysis.themes)
      ? analysis.themes
          .slice(0, 3)
          .filter((t) => STORY_TAXONOMY.themes.includes(t))
      : [],
    emotions: Array.isArray(analysis.emotions)
      ? analysis.emotions
          .slice(0, 3)
          .filter((e) => STORY_TAXONOMY.emotions.includes(e))
      : [],
    timePeriod: analysis.timePeriod || "unknown",
    lifeStage: analysis.lifeStage || "unknown",
    people: Array.isArray(analysis.people)
      ? analysis.people.slice(0, 10).map((p) => ({
          name: p.name || "Unknown",
          relationship: p.relationship || "unknown",
        }))
      : [],
    locations: Array.isArray(analysis.locations)
      ? analysis.locations.slice(0, 5).filter((l) => l && l.trim())
      : [],
    keyEvents: Array.isArray(analysis.keyEvents)
      ? analysis.keyEvents.slice(0, 5).filter((e) => e && e.trim())
      : [],
    summary: analysis.summary ? analysis.summary.substring(0, 150) : "",
    analyzedAt: new Date().toISOString(),
    confidence: "high",
  };
}

/**
 * Return empty analysis when everything fails
 */
function getEmptyAnalysis() {
  return {
    themes: [],
    emotions: [],
    timePeriod: "unknown",
    lifeStage: "unknown",
    people: [],
    locations: [],
    keyEvents: [],
    summary: "",
    analyzedAt: new Date().toISOString(),
    confidence: "none",
  };
}

/**
 * Test function to verify OpenAI connection
 */
export async function testOpenAI() {
  try {
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Say 'OpenAI is working!'" }],
      max_tokens: 20,
    });

    console.log("✅ OpenAI Test Result:", response.choices[0].message.content);
    return true;
  } catch (error) {
    console.error("❌ OpenAI Test Failed:", error.message);
    return false;
  }
}

/**
 * Analyze a single image and return tags
 */
export async function analyzeImage(imageUrl, description = "") {
  const { default: OpenAI } = await import("openai");
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const prompt = description
      ? `Analyze this image with context: "${description}". Extract themes, emotions, time period, and any visible details.`
      : `Analyze this image and extract themes, emotions, time period, and any visible details about the setting, people, and activities.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "low",
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    console.log("Image analysis result:", response.choices[0].message.content);
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Image analysis error:", error);
    return null;
  }
}
