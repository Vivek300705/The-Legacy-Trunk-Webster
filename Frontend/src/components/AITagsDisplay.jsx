import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Button,
  Divider,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  AutoAwesome,
  Refresh,
  CalendarToday,
  EmojiEmotions,
  LocalOffer,
  Person,
  Place,
  Event,
} from "@mui/icons-material";
import { getStoryAnalysis, triggerStoryAnalysis } from "../api/services";

const AITagsDisplay = ({ storyId, showTitle = true }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalysis();
  }, [storyId]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getStoryAnalysis(storyId);
      setAnalysis(data);
    } catch (err) {
      console.log("No AI analysis found:", err);
      setError("");
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReanalyze = async () => {
    try {
      setReanalyzing(true);
      setError("");
      await triggerStoryAnalysis(storyId);

      // Wait 3 seconds then refetch
      setTimeout(() => {
        fetchAnalysis();
        setReanalyzing(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to trigger analysis:", err);
      setError(err.response?.data?.message || "Failed to trigger analysis");
      setReanalyzing(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 2 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Loading AI analysis...
        </Typography>
      </Box>
    );
  }

  if (!analysis && !error) {
    return (
      <Paper sx={{ p: 2, bgcolor: "background.paper", borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <AutoAwesome sx={{ fontSize: 20, color: "primary.main" }} />
          <Typography variant="body2" color="text.secondary">
            No AI analysis yet
          </Typography>
        </Box>
        <Button
          size="small"
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleReanalyze}
          disabled={reanalyzing}
        >
          {reanalyzing ? "Analyzing..." : "Generate AI Tags"}
        </Button>
      </Paper>
    );
  }

  if (error) {
    return (
      <Alert severity="error" onClose={() => setError("")}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 20%)",
      }}
    >
      {showTitle && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AutoAwesome sx={{ fontSize: 24, color: "primary.main" }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              AI-Generated Tags
            </Typography>
          </Box>
          <Tooltip title="Re-analyze with AI">
            <Button
              size="small"
              variant="text"
              startIcon={<Refresh />}
              onClick={handleReanalyze}
              disabled={reanalyzing}
              sx={{ textTransform: "none" }}
            >
              {reanalyzing ? "Analyzing..." : "Update"}
            </Button>
          </Tooltip>
        </Box>
      )}

      {/* Summary */}
      {analysis.summary && (
        <Box sx={{ mb: 2, p: 1.5, bgcolor: "white", borderRadius: 1 }}>
          <Typography
            variant="body2"
            sx={{ fontStyle: "italic", color: "text.secondary" }}
          >
            "{analysis.summary}"
          </Typography>
        </Box>
      )}

      <Stack spacing={2}>
        {/* Themes */}
        {analysis.themes && analysis.themes.length > 0 && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <LocalOffer sx={{ fontSize: 18, color: "primary.main" }} />
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
              >
                THEMES
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {analysis.themes.map((theme) => (
                <Chip
                  key={theme}
                  label={theme}
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 500 }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Emotions */}
        {analysis.emotions && analysis.emotions.length > 0 && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <EmojiEmotions sx={{ fontSize: 18, color: "secondary.main" }} />
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
              >
                EMOTIONS
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {analysis.emotions.map((emotion) => (
                <Chip
                  key={emotion}
                  label={emotion}
                  size="small"
                  color="secondary"
                  sx={{ fontWeight: 500 }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Time Period & Life Stage */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {analysis.timePeriod && analysis.timePeriod !== "unknown" && (
            <Box sx={{ flex: 1, minWidth: 120 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <CalendarToday sx={{ fontSize: 18, color: "info.main" }} />
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                >
                  TIME PERIOD
                </Typography>
              </Box>
              <Chip
                label={analysis.timePeriod}
                size="small"
                color="info"
                sx={{ fontWeight: 500 }}
              />
            </Box>
          )}

          {analysis.lifeStage && analysis.lifeStage !== "unknown" && (
            <Box sx={{ flex: 1, minWidth: 120 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Person sx={{ fontSize: 18, color: "success.main" }} />
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                >
                  LIFE STAGE
                </Typography>
              </Box>
              <Chip
                label={analysis.lifeStage}
                size="small"
                color="success"
                sx={{ fontWeight: 500 }}
              />
            </Box>
          )}
        </Box>

        {/* Locations */}
        {analysis.locations && analysis.locations.length > 0 && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Place sx={{ fontSize: 18, color: "warning.main" }} />
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
              >
                LOCATIONS
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {analysis.locations.map((location, idx) => (
                <Chip
                  key={idx}
                  label={location}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Key Events */}
        {analysis.keyEvents && analysis.keyEvents.length > 0 && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Event sx={{ fontSize: 18, color: "error.main" }} />
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
              >
                KEY EVENTS
              </Typography>
            </Box>
            <Stack spacing={0.5}>
              {analysis.keyEvents.map((event, idx) => (
                <Typography
                  key={idx}
                  variant="body2"
                  sx={{
                    pl: 2,
                    color: "text.secondary",
                    "&:before": {
                      content: '"• "',
                      fontWeight: 700,
                    },
                  }}
                >
                  {event}
                </Typography>
              ))}
            </Stack>
          </Box>
        )}

        {/* People */}
        {analysis.people && analysis.people.length > 0 && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Person sx={{ fontSize: 18, color: "primary.main" }} />
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
              >
                PEOPLE MENTIONED
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {analysis.people.map((person, idx) => (
                <Chip
                  key={idx}
                  label={`${person.name}${
                    person.relationship !== "unknown"
                      ? ` (${person.relationship})`
                      : ""
                  }`}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ fontWeight: 500 }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Stack>

      {/* Footer */}
      <Divider sx={{ my: 2 }} />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
      >
        <AutoAwesome sx={{ fontSize: 14 }} />
        Analyzed by AI on {new Date(analysis.analyzedAt).toLocaleDateString()}
      </Typography>
    </Paper>
  );
};

export default AITagsDisplay;
