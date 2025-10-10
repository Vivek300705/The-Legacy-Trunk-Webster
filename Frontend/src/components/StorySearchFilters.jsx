import { useState } from "react";
import {
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Chip,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Search, Clear } from "@mui/icons-material";

const StorySearchFilters = ({
  onResults,
  onSearch,
  availableTags = {},
  loading = false,
}) => {
  const [selectedTheme, setSelectedTheme] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("");
  const [selectedLifeStage, setSelectedLifeStage] = useState("");

  // Extract tags from availableTags prop
  const themes = availableTags.themes || [
    "Family",
    "Love",
    "Adventure",
    "Career",
    "Education",
    "Travel",
    "Celebration",
    "Loss",
    "Growth",
  ];

  const emotions = availableTags.emotions || [
    "Joy",
    "Sadness",
    "Love",
    "Pride",
    "Nostalgia",
    "Gratitude",
    "Hope",
    "Fear",
    "Excitement",
  ];

  const timePeriods = availableTags.timePeriods || [
    "Childhood",
    "Teenage Years",
    "Young Adult",
    "Middle Age",
    "Senior Years",
    "1950s",
    "1960s",
    "1970s",
    "1980s",
    "1990s",
    "2000s",
    "2010s",
    "2020s",
  ];

  const lifeStages = availableTags.lifeStages || [
    "Birth",
    "Childhood",
    "School Years",
    "College",
    "First Job",
    "Marriage",
    "Parenthood",
    "Career Peak",
    "Retirement",
    "Grandparenthood",
  ];

  const handleSearch = async () => {
    // Build filters object
    const filters = {};

    if (selectedTheme) filters.themes = selectedTheme;
    if (selectedEmotion) filters.emotions = selectedEmotion;
    if (selectedTimePeriod) filters.timePeriod = selectedTimePeriod;
    if (selectedLifeStage) filters.lifeStage = selectedLifeStage;

    console.log("🔍 AI Search filters:", filters);

    // Call the search function passed from parent
    if (onSearch) {
      await onSearch(filters);
    }
  };

  const handleClearFilters = () => {
    setSelectedTheme("");
    setSelectedEmotion("");
    setSelectedTimePeriod("");
    setSelectedLifeStage("");

    // Clear results
    if (onResults) {
      onResults([]);
    }
  };

  const hasFilters =
    selectedTheme || selectedEmotion || selectedTimePeriod || selectedLifeStage;

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }} elevation={2}>
      <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
        🤖 AI Smart Search Filters
      </Typography>

      <Grid container spacing={2}>
        {/* Theme Filter */}
        <Grid item xs={12} sm={6} md={6} lg={3} width={"200px"}>
          <FormControl fullWidth variant="outlined">
            <InputLabel
              id="theme-label"
              sx={{
                bgcolor: "background.paper",
                px: 0.5,
              }}
            >
              Theme
            </InputLabel>
            <Select
              labelId="theme-label"
              id="theme-select"
              value={selectedTheme}
              label="Theme"
              onChange={(e) => setSelectedTheme(e.target.value)}
              sx={{
                minHeight: 56,
                "& .MuiSelect-select": {
                  py: 2,
                  display: "flex",
                  alignItems: "center",
                },
                "& .MuiInputLabel-root": {
                  backgroundColor: "white",
                },
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {themes.map((theme) => (
                <MenuItem key={theme} value={theme}>
                  {theme}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Emotion Filter */}
        <Grid item xs={12} sm={6} md={6} lg={3} width={"200px"}>
          <FormControl fullWidth variant="outlined">
            <InputLabel
              id="emotion-label"
              sx={{
                bgcolor: "background.paper",
                px: 0.5,
              }}
            >
              Emotion
            </InputLabel>
            <Select
              labelId="emotion-label"
              id="emotion-select"
              value={selectedEmotion}
              label="Emotion"
              onChange={(e) => setSelectedEmotion(e.target.value)}
              sx={{
                minHeight: 56,
                "& .MuiSelect-select": {
                  py: 2,
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {emotions.map((emotion) => (
                <MenuItem key={emotion} value={emotion}>
                  {emotion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Time Period Filter */}
        <Grid item xs={12} sm={6} md={6} lg={3} width={"200px"}>
          <FormControl fullWidth variant="outlined">
            <InputLabel
              id="time-period-label"
              sx={{
                bgcolor: "background.paper",
                px: 0.5,
              }}
            >
              Time Period
            </InputLabel>
            <Select
              labelId="time-period-label"
              id="time-period-select"
              value={selectedTimePeriod}
              label="Time Period"
              onChange={(e) => setSelectedTimePeriod(e.target.value)}
              sx={{
                minHeight: 56,
                "& .MuiSelect-select": {
                  py: 2,
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {timePeriods.map((period) => (
                <MenuItem key={period} value={period}>
                  {period}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Life Stage Filter */}
        <Grid item xs={12} sm={6} md={6} lg={3} width={"200px"}>
          <FormControl fullWidth variant="outlined">
            <InputLabel
              id="life-stage-label"
              sx={{
                bgcolor: "background.paper",
                px: 0.5,
              }}
            >
              Life Stage
            </InputLabel>
            <Select
              labelId="life-stage-label"
              id="life-stage-select"
              value={selectedLifeStage}
              label="Life Stage"
              onChange={(e) => setSelectedLifeStage(e.target.value)}
              sx={{
                minHeight: 56,
                "& .MuiSelect-select": {
                  py: 2,
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {lifeStages.map((stage) => (
                <MenuItem key={stage} value={stage}>
                  {stage}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Selected Filters Display */}
      {hasFilters && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Active Filters:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {selectedTheme && (
              <Chip
                label={`Theme: ${selectedTheme}`}
                onDelete={() => setSelectedTheme("")}
                color="primary"
                size="medium"
              />
            )}
            {selectedEmotion && (
              <Chip
                label={`Emotion: ${selectedEmotion}`}
                onDelete={() => setSelectedEmotion("")}
                color="secondary"
                size="medium"
              />
            )}
            {selectedTimePeriod && (
              <Chip
                label={`Period: ${selectedTimePeriod}`}
                onDelete={() => setSelectedTimePeriod("")}
                color="info"
                size="medium"
              />
            )}
            {selectedLifeStage && (
              <Chip
                label={`Stage: ${selectedLifeStage}`}
                onDelete={() => setSelectedLifeStage("")}
                color="success"
                size="medium"
              />
            )}
          </Stack>
        </Box>
      )}

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Search />
            )
          }
          onClick={handleSearch}
          disabled={!hasFilters || loading}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 4,
            py: 1.5,
          }}
        >
          {loading ? "Searching..." : "Search Stories"}
        </Button>

        {hasFilters && (
          <Button
            variant="outlined"
            size="large"
            startIcon={<Clear />}
            onClick={handleClearFilters}
            disabled={loading}
            sx={{
              textTransform: "none",
              px: 3,
              py: 1.5,
            }}
          >
            Clear Filters
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

export default StorySearchFilters;
