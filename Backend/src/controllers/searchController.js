import Story from "../models/Story.model.js";
import User from "../models/User.model.js";

export const searchContent = async (req, res) => {
  try {
    console.log("🔍 Search endpoint hit!");
    console.log("Query params:", req.query);
    console.log("User:", req.user?.name, req.user?.email);
    console.log("User Family Circle:", req.user?.familyCircle);

    const { q: query, type, dateFrom, dateTo } = req.query;
    const userId = req.user._id;
    const userFamilyCircle = req.user.familyCircle;

    // Check if user has a family circle
    if (!userFamilyCircle) {
      console.log("❌ User has no family circle");
      return res.status(200).json({
        query: query || "",
        count: 0,
        results: [],
        message: "You need to join a family circle to search",
      });
    }

    const results = [];
    const searchTerm = query ? query.trim() : "";
    const isEmptySearch = !searchTerm;
    console.log("✅ Searching for:", searchTerm || "(empty - show all)");

    // Build date filter if provided
    const dateFilter = {};
    if (dateFrom) dateFilter.$gte = new Date(dateFrom);
    if (dateTo) dateFilter.$lte = new Date(dateTo);

    // Search Stories
    if (!type || type === "story" || type === "event") {
      const storyQuery = {
        familyCircle: userFamilyCircle,
      };

      // Only add search filters if there's a search term
      if (searchTerm) {
        storyQuery.$or = [
          { title: { $regex: searchTerm, $options: "i" } },
          { content: { $regex: searchTerm, $options: "i" } },
          { tags: { $regex: searchTerm, $options: "i" } },
        ];
      }

      if (Object.keys(dateFilter).length > 0) {
        storyQuery.eventDate = dateFilter;
      }

      console.log("📖 Story query:", JSON.stringify(storyQuery, null, 2));

      const stories = await Story.find(storyQuery)
        .populate("author", "name email")
        .limit(50)
        .sort({ createdAt: -1 });

      console.log(`📚 Found ${stories.length} stories`);

      stories.forEach((story) => {
        // Create snippet from content
        const contentLower = story.content?.toLowerCase() || "";
        const queryLower = searchTerm.toLowerCase();
        const index = contentLower.indexOf(queryLower);
        let snippet = "";

        if (index !== -1) {
          const start = Math.max(0, index - 50);
          const end = Math.min(
            story.content.length,
            index + searchTerm.length + 50
          );
          snippet =
            (start > 0 ? "..." : "") +
            story.content.substring(start, end) +
            (end < story.content.length ? "..." : "");
        } else {
          snippet =
            story.content?.substring(0, 150) +
            (story.content?.length > 150 ? "..." : "");
        }

        results.push({
          id: story._id,
          type: story.isEvent ? "event" : "story",
          title: story.title,
          snippet: snippet,
          author: story.author?.name || "Unknown",
          authorId: story.author?._id,
          date: story.eventDate || story.createdAt,
        });
      });
    }

    // Don't search for people as separate results anymore
    // People will only be used for filtering stories by author

    // Sort results by relevance
    if (searchTerm) {
      // Sort by relevance when there's a search term
      results.sort((a, b) => {
        const aExact = a.title.toLowerCase() === searchTerm.toLowerCase();
        const bExact = b.title.toLowerCase() === searchTerm.toLowerCase();

        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;

        return new Date(b.date) - new Date(a.date);
      });
    } else {
      // Sort by date when showing all results
      results.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    console.log(`✅ Returning ${results.length} total results`);

    res.status(200).json({
      query: searchTerm,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("❌ Search error:", error);
    res.status(500).json({
      message: "Error searching content",
      error: error.message,
      results: [],
    });
  }
};
