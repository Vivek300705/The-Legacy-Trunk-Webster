import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Chip,
  Stack,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Button,
  Collapse,
} from "@mui/material";
import {
  Person,
  CalendarToday,
  Label,
  MoreVert,
  Edit,
  Delete,
  AutoAwesome,
  ExpandMore,
  ExpandLess,
  Refresh,
  CheckCircle,
} from "@mui/icons-material";
import {
  getStoryById,
  deleteStory,
  getStoryAnalysis,
  triggerStoryAnalysis,
} from "../api/services";

const StoryDetail = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  // AI Analysis states
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [analysisExpanded, setAnalysisExpanded] = useState(true);
  const [pollAttempt, setPollAttempt] = useState(0);
  const [pollMessage, setPollMessage] = useState("");

  useEffect(() => {
    if (storyId) {
      fetchStory();
      fetchAnalysis();
    }
  }, [storyId]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStoryById(storyId);
      console.log("✅ Story fetched:", data);
      setStory(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load story");
      console.error("❌ Error fetching story:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalysis = async () => {
    try {
      console.log("🔍 Fetching analysis for story:", storyId);
      const data = await getStoryAnalysis(storyId);
      console.log("✅ Analysis fetched:", data);

      if (data && (data.themes?.length > 0 || data.emotions?.length > 0)) {
        setAnalysis(data);
        console.log("✅ Analysis data set:", data);
      }
    } catch (err) {
      console.log("ℹ️ No analysis found yet:", err.response?.status);
      // Don't set error for 404 - it just means no analysis exists yet
      if (err.response?.status !== 404) {
        console.error("❌ Error fetching analysis:", err);
      }
    }
  };

  const handleTriggerAnalysis = async () => {
    try {
      setAnalysisLoading(true);
      setAnalysisError(null);
      setPollAttempt(0);
      setPollMessage("Sending story to AI...");
      console.log("🚀 Triggering analysis for story:", storyId);

      const result = await triggerStoryAnalysis(storyId);
      console.log("✅ Analysis triggered:", result);
      setPollMessage("AI is analyzing your story...");

      // Start polling for results
      let attempts = 0;
      const maxAttempts = 30; // Poll for up to 60 seconds (30 * 2s)

      const pollInterval = setInterval(async () => {
        attempts++;
        setPollAttempt(attempts);
        setPollMessage(`Checking results (${attempts}/${maxAttempts})...`);
        console.log(`🔄 Poll attempt ${attempts}/${maxAttempts}`);

        try {
          const data = await getStoryAnalysis(storyId);
          console.log("📊 Poll result:", data);

          // Check if we have actual analysis data
          if (data && (data.themes?.length > 0 || data.emotions?.length > 0)) {
            console.log("✅ Analysis completed! Setting data...");
            setPollMessage("Analysis complete! 🎉");
            setAnalysis(data);
            setAnalysisLoading(false);
            setAnalysisExpanded(true);
            clearInterval(pollInterval);

            // Clear poll message after 2 seconds
            setTimeout(() => {
              setPollMessage("");
              setPollAttempt(0);
            }, 2000);
          } else if (attempts >= maxAttempts) {
            console.log("⏱️ Polling timeout");
            setAnalysisError(
              "Analysis is taking longer than expected. Please refresh the page."
            );
            setAnalysisLoading(false);
            setPollMessage("");
            clearInterval(pollInterval);
          }
        } catch (err) {
          console.log(
            `⚠️ Poll attempt ${attempts} failed:`,
            err.response?.status
          );
          if (attempts >= maxAttempts) {
            setAnalysisError(
              "Failed to fetch analysis results. Please try again."
            );
            setAnalysisLoading(false);
            setPollMessage("");
            clearInterval(pollInterval);
          }
        }
      }, 2000); // Poll every 2 seconds
    } catch (err) {
      console.error("❌ Error triggering analysis:", err);
      setAnalysisError(
        err.response?.data?.message || "Failed to analyze story"
      );
      setAnalysisLoading(false);
      setPollMessage("");
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    navigate(`/story-editor?id=${storyId}`);
  };

  const handleDelete = async () => {
    handleMenuClose();
    if (window.confirm("Are you sure you want to delete this story?")) {
      try {
        await deleteStory(storyId);
        navigate("/timeline");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete story");
        console.error("Error deleting story:", err);
      }
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAFAFA",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: "100vh", py: 6, backgroundColor: "#FAFAFA" }}>
        <Container maxWidth="sm">
          <Alert severity="error">{error}</Alert>
        </Container>
      </Box>
    );
  }

  if (!story) {
    return (
      <Box sx={{ minHeight: "100vh", py: 6, backgroundColor: "#FAFAFA" }}>
        <Container maxWidth="sm">
          <Alert severity="info">Story not found</Alert>
        </Container>
      </Box>
    );
  }

  // Separate media by type
  const images =
    story.media?.filter(
      (m) =>
        m.type === "image" ||
        m.mimeType?.startsWith("image/") ||
        m.mediaType === "photo"
    ) || [];
  const videos =
    story.media?.filter(
      (m) =>
        m.type === "video" ||
        m.mimeType?.startsWith("video/") ||
        m.mediaType === "video"
    ) || [];
  const audio =
    story.media?.filter(
      (m) =>
        m.type === "audio" ||
        m.mimeType?.startsWith("audio/") ||
        m.mediaType === "audio"
    ) || [];

  // Check if we have analysis data to display
  const hasAnalysisData =
    analysis &&
    ((analysis.themes && analysis.themes.length > 0) ||
      (analysis.emotions && analysis.emotions.length > 0) ||
      (analysis.timePeriod && analysis.timePeriod !== "unknown") ||
      (analysis.lifeStage && analysis.lifeStage !== "unknown"));

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#FAFAFA", py: 3 }}>
      <Container maxWidth="sm" sx={{ px: { xs: 0, sm: 2 } }}>
        {/* Instagram-style Post Card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: { xs: 0, sm: 3 },
            border: { xs: "none", sm: "1px solid #DBDBDB" },
            backgroundColor: "white",
            mb: 3,
          }}
        >
          {/* Post Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: "primary.main",
                }}
              >
                {(story.author?.name || "A")[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, lineHeight: 1.2 }}
                >
                  {story.author?.name || "Anonymous"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(story.date || story.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleEdit}>
                <Edit sx={{ mr: 1 }} fontSize="small" />
                Edit
              </MenuItem>
              <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
                <Delete sx={{ mr: 1 }} fontSize="small" />
                Delete
              </MenuItem>
            </Menu>
          </Box>

          {/* Images */}
          {images.length > 0 && (
            <Box
              sx={{
                width: "100%",
                position: "relative",
                backgroundColor: "#000",
              }}
            >
              {images.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    width: "100%",
                    maxHeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={item.url || item.fileUrl}
                    alt={item.caption || item.description}
                    sx={{
                      width: "100%",
                      maxHeight: 600,
                      objectFit: "contain",
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}

          {/* Videos */}
          {videos.map((item, index) => (
            <Box key={index} sx={{ width: "100%", backgroundColor: "#000" }}>
              <video
                controls
                style={{
                  width: "100%",
                  maxHeight: "600px",
                  display: "block",
                }}
              >
                <source
                  src={item.url || item.fileUrl}
                  type={item.mimeType || "video/mp4"}
                />
              </video>
            </Box>
          ))}

          {/* Content Section */}
          <Box sx={{ p: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1,
                lineHeight: 1.3,
              }}
            >
              {story.title}
            </Typography>

            <Box sx={{ mb: 2 }}>
              {story.content.split("\n\n").map((paragraph, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{
                    mb: 1.5,
                    lineHeight: 1.6,
                    color: "text.primary",
                  }}
                >
                  {paragraph}
                </Typography>
              ))}
            </Box>

            {story.tags && story.tags.length > 0 && (
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                gap={0.5}
                sx={{ mb: 2 }}
              >
                {story.tags.map((tag) => (
                  <Typography
                    key={tag}
                    variant="caption"
                    sx={{
                      color: "primary.main",
                      fontWeight: 500,
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    #{tag}
                  </Typography>
                ))}
              </Stack>
            )}

            {audio.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Audio Recordings
                </Typography>
                <Stack spacing={2}>
                  {audio.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        backgroundColor: "#F5F5F5",
                        borderRadius: 2,
                      }}
                    >
                      <audio controls style={{ width: "100%" }}>
                        <source
                          src={item.url || item.fileUrl}
                          type={item.mimeType || "audio/mpeg"}
                        />
                      </audio>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        </Paper>

        {/* AI Analysis Section */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: { xs: 0, sm: 3 },
            border: { xs: "none", sm: "1px solid #DBDBDB" },
            backgroundColor: "white",
            mb: 3,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => setAnalysisExpanded(!analysisExpanded)}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AutoAwesome sx={{ color: "white" }} />
              <Typography variant="subtitle1" fontWeight={600} color="white">
                AI Story Analysis
              </Typography>
              {hasAnalysisData && (
                <Chip
                  icon={<CheckCircle sx={{ fontSize: 16 }} />}
                  label="Analyzed"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                    borderRadius: "12px",
                    height: 24,
                    fontSize: "0.75rem",
                  }}
                />
              )}
            </Box>
            <IconButton size="small" sx={{ color: "white" }}>
              {analysisExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Collapse in={analysisExpanded}>
            <Box sx={{ p: 2 }}>
              {analysisError && (
                <Alert
                  severity="error"
                  sx={{ mb: 2 }}
                  onClose={() => setAnalysisError(null)}
                >
                  {analysisError}
                </Alert>
              )}

              {!hasAnalysisData && !analysisLoading && (
                <Box sx={{ textAlign: "center", py: 3 }}>
                  <AutoAwesome sx={{ fontSize: 48, color: "#667eea", mb: 2 }} />
                  <Typography variant="body1" gutterBottom fontWeight={600}>
                    Get AI-powered insights about this story
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Discover themes, emotions, time periods, and more
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AutoAwesome />}
                    onClick={handleTriggerAnalysis}
                    sx={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      textTransform: "none",
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Analyze Story with AI
                  </Button>
                </Box>
              )}

              {analysisLoading && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <CircularProgress
                    size={48}
                    sx={{ color: "#667eea" }}
                    variant={pollAttempt > 0 ? "determinate" : "indeterminate"}
                    value={pollAttempt > 0 ? (pollAttempt / 30) * 100 : 0}
                  />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ mt: 2, color: "#667eea" }}
                  >
                    {pollMessage || "AI is analyzing your story..."}
                  </Typography>
                  {pollAttempt > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Box
                        sx={{
                          width: "100%",
                          height: 8,
                          backgroundColor: "#f0f0f0",
                          borderRadius: 4,
                          overflow: "hidden",
                          mb: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: `${(pollAttempt / 30) * 100}%`,
                            height: "100%",
                            background:
                              "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {pollAttempt} of 30 checks completed
                      </Typography>
                    </Box>
                  )}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 2 }}
                  >
                    💡 Analyzing text, themes, emotions, and time period...
                  </Typography>
                </Box>
              )}

              {hasAnalysisData && (
                <Box>
                  <Alert
                    severity="success"
                    icon={<CheckCircle />}
                    sx={{ mb: 2 }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      Analysis Complete!
                    </Typography>
                    <Typography variant="caption">
                      AI has analyzed your story and extracted the following
                      insights:
                    </Typography>
                  </Alert>

                  {/* Themes */}
                  {analysis.themes && analysis.themes.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        🎯 Themes
                      </Typography>
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {analysis.themes.map((theme, idx) => (
                          <Chip
                            key={idx}
                            label={theme}
                            size="medium"
                            sx={{
                              backgroundColor: "#e3f2fd",
                              color: "#1976d2",
                              fontWeight: 500,
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {/* Emotions */}
                  {analysis.emotions && analysis.emotions.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        💖 Emotions
                      </Typography>
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {analysis.emotions.map((emotion, idx) => (
                          <Chip
                            key={idx}
                            label={emotion}
                            size="medium"
                            sx={{
                              backgroundColor: "#fce4ec",
                              color: "#c2185b",
                              fontWeight: 500,
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {/* Time Period */}
                  {analysis.timePeriod && analysis.timePeriod !== "unknown" && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        📅 Time Period
                      </Typography>
                      <Chip
                        label={analysis.timePeriod}
                        size="medium"
                        sx={{
                          backgroundColor: "#fff3e0",
                          color: "#e65100",
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                  )}

                  {/* Life Stage */}
                  {analysis.lifeStage && analysis.lifeStage !== "unknown" && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        👤 Life Stage
                      </Typography>
                      <Chip
                        label={analysis.lifeStage}
                        size="medium"
                        sx={{
                          backgroundColor: "#f3e5f5",
                          color: "#7b1fa2",
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                  )}

                  {/* Locations */}
                  {analysis.locations && analysis.locations.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        📍 Locations
                      </Typography>
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {analysis.locations.map((location, idx) => (
                          <Chip
                            key={idx}
                            label={location}
                            size="medium"
                            sx={{
                              backgroundColor: "#e8f5e9",
                              color: "#2e7d32",
                              fontWeight: 500,
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={
                      analysisLoading ? (
                        <CircularProgress size={16} />
                      ) : (
                        <Refresh />
                      )
                    }
                    onClick={handleTriggerAnalysis}
                    disabled={analysisLoading}
                    sx={{ textTransform: "none" }}
                  >
                    {analysisLoading ? "Re-analyzing..." : "Re-analyze with AI"}
                  </Button>
                </Box>
              )}
            </Box>
          </Collapse>
        </Paper>

        {/* Additional Images */}
        {images.length > 1 && (
          <Paper
            elevation={0}
            sx={{
              borderRadius: { xs: 0, sm: 3 },
              border: { xs: "none", sm: "1px solid #DBDBDB" },
              backgroundColor: "white",
              p: 2,
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              All Photos ({images.length})
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1,
              }}
            >
              {images.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    paddingTop: "100%",
                    overflow: "hidden",
                    borderRadius: 1,
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 0.8,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={item.url || item.fileUrl}
                    alt={item.caption || `Image ${index + 1}`}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default StoryDetail;
