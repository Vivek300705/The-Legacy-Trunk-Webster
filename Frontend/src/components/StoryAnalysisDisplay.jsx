import React from "react";
import { Chip, Box, Typography, Paper } from "@mui/material";
import {
  LocalOffer,
  EmojiEmotions,
  CalendarToday,
  Person,
  Place,
} from "@mui/icons-material";

export default function StoryAnalysisDisplay({ analysis }) {
  if (!analysis) {
    return (
      <Paper sx={{ p: 2, mt: 2, bgcolor: "grey.50" }}>
        <Typography variant="body2" color="text.secondary">
          AI analysis in progress...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mt: 2, bgcolor: "background.default" }}>
      <Typography variant="h6" gutterBottom>
        AI Story Analysis
      </Typography>

      {/* Summary */}
      {analysis.summary && (
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            "{analysis.summary}"
          </Typography>
        </Box>
      )}

      {/* Themes */}
      {analysis.themes && analysis.themes.length > 0 && (
        <Box mb={2}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <LocalOffer fontSize="small" color="primary" />
            <Typography variant="subtitle2">Themes</Typography>
          </Box>
          <Box display="flex" gap={1} flexWrap="wrap">
            {analysis.themes.map((theme) => (
              <Chip
                key={theme}
                label={theme}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Emotions */}
      {analysis.emotions && analysis.emotions.length > 0 && (
        <Box mb={2}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <EmojiEmotions fontSize="small" color="secondary" />
            <Typography variant="subtitle2">Emotions</Typography>
          </Box>
          <Box display="flex" gap={1} flexWrap="wrap">
            {analysis.emotions.map((emotion) => (
              <Chip
                key={emotion}
                label={emotion}
                size="small"
                color="secondary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Time Period & Life Stage */}
      <Box display="flex" gap={3} mb={2}>
        {analysis.timePeriod && analysis.timePeriod !== "unknown" && (
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarToday fontSize="small" />
            <Typography variant="body2">
              <strong>Era:</strong> {analysis.timePeriod}
            </Typography>
          </Box>
        )}
        {analysis.lifeStage && analysis.lifeStage !== "unknown" && (
          <Box display="flex" alignItems="center" gap={1}>
            <Person fontSize="small" />
            <Typography variant="body2">
              <strong>Life Stage:</strong> {analysis.lifeStage}
            </Typography>
          </Box>
        )}
      </Box>

      {/* People */}
      {analysis.people && analysis.people.length > 0 && (
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            People Mentioned
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {analysis.people.map((person, idx) => (
              <Chip
                key={idx}
                label={`${person.name} (${person.relationship})`}
                size="small"
                variant="filled"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Locations */}
      {analysis.locations && analysis.locations.length > 0 && (
        <Box mb={2}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Place fontSize="small" color="success" />
            <Typography variant="subtitle2">Locations</Typography>
          </Box>
          <Box display="flex" gap={1} flexWrap="wrap">
            {analysis.locations.map((location) => (
              <Chip
                key={location}
                label={location}
                size="small"
                color="success"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
}
