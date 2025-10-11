import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Collapse,
  Paper,
} from "@mui/material";
import {
  AutoAwesome,
  Refresh,
  ExpandMore,
  ExpandLess,
  CheckCircle,
  HourglassEmpty,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { triggerAIAnalysis } from "../api/services";

const AIAnalysisSection = ({ storyId, analysis, onAnalysisComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(true);

  const handleTriggerAnalysis = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await triggerAIAnalysis(storyId);
      if (onAnalysisComplete) {
        onAnalysisComplete(result.analysis);
      }
    } catch (err) {
      console.error("Failed to trigger AI analysis:", err);
      setError(err.response?.data?.message || "Failed to analyze story");
    } finally {
      setLoading(false);
    }
  };

  const isPending = !analysis || analysis.status === "pending";
  const isFailed = analysis?.status === "failed";
  const isCompleted = analysis && analysis.themes && analysis.themes.length > 0;

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: "primary.50",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AutoAwesome color="primary" />
          <Typography variant="subtitle1" fontWeight={600} color="primary">
            AI Smart Tags
          </Typography>
          {isCompleted && (
            <Chip
              icon={<CheckCircle />}
              label="Active"
              size="small"
              color="success"
              sx={{ borderRadius: "12px" }}
            />
          )}
          {isPending && (
            <Chip
              icon={<HourglassEmpty />}
              label="Analyzing..."
              size="small"
              color="default"
              sx={{ borderRadius: "12px" }}
            />
          )}
        </Box>
        <IconButton size="small">
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Pending State */}
          {isPending && (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <CircularProgress size={40} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                AI is analyzing your story...
              </Typography>
              <Typography variant="caption" color="text.secondary">
                This usually takes 5-10 seconds
              </Typography>
            </Box>
          )}

          {/* Failed State */}
          {isFailed && (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <ErrorIcon color="error" sx={{ fontSize: 40 }} />
              <Typography variant="body2" color="error" sx={{ mt: 2, mb: 2 }}>
                AI analysis failed
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleTriggerAnalysis}
                disabled={loading}
              >
                Retry Analysis
              </Button>
            </Box>
          )}

          {/* Completed State */}
          {isCompleted && (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 2, display: "block" }}
              >
                AI has automatically tagged your story. These tags help with
                smart search and discovery.
              </Typography>

              {/* Themes */}
              {analysis.themes && analysis.themes.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="primary"
                    sx={{ mb: 0.5, display: "block" }}
                  >
                    🎯 Themes:
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={0.5}>
                    {analysis.themes.map((theme) => (
                      <Chip
                        key={theme}
                        label={theme}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Emotions */}
              {analysis.emotions && analysis.emotions.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="secondary"
                    sx={{ mb: 0.5, display: "block" }}
                  >
                    💖 Emotions:
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={0.5}>
                    {analysis.emotions.map((emotion) => (
                      <Chip
                        key={emotion}
                        label={emotion}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Time Period */}
              {analysis.timePeriod && analysis.timePeriod !== "unknown" && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="info"
                    sx={{ mb: 0.5, display: "block" }}
                  >
                    📅 Time Period:
                  </Typography>
                  <Chip
                    label={analysis.timePeriod}
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                </Box>
              )}

              {/* Life Stage */}
              {analysis.lifeStage && analysis.lifeStage !== "unknown" && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="warning"
                    sx={{ mb: 0.5, display: "block" }}
                  >
                    👤 Life Stage:
                  </Typography>
                  <Chip
                    label={analysis.lifeStage}
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Button
                fullWidth
                variant="outlined"
                size="small"
                startIcon={
                  loading ? <CircularProgress size={16} /> : <Refresh />
                }
                onClick={handleTriggerAnalysis}
                disabled={loading}
                sx={{ textTransform: "none" }}
              >
                {loading ? "Re-analyzing..." : "Re-analyze with AI"}
              </Button>
            </Box>
          )}

          {/* Show button to trigger analysis if not started */}
          {!storyId && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Save the story first to enable AI analysis
            </Alert>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default AIAnalysisSection;
