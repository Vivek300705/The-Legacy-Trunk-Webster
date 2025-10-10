import { useState, useEffect } from "react";
import {
<<<<<<< HEAD
  Container,
=======
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Chip,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Alert,
  CircularProgress,
  Tooltip,
  Divider,
<<<<<<< HEAD
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
=======
} from "@mui/material";
import {
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
  CloudUpload,
  Close,
  Save,
  ArrowBack,
  Image,
  VideoLibrary,
  AudioFile,
  Cancel,
<<<<<<< HEAD
  LocalOffer,
  EmojiEmotions,
  CalendarToday,
  Person as PersonIcon,
=======
  FormatBold,
  FormatItalic,
  FormatListBulleted,
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  uploadMedia,
  createStory,
  updateStory,
  getStoryById,
} from "../api/services";

const StoryEditor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storyId = searchParams.get("id");

  const [isEditMode, setIsEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
<<<<<<< HEAD

  // OLD: Simple tags array
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // NEW: Structured tags for AI compatibility
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("");
  const [selectedLifeStage, setSelectedLifeStage] = useState("");

  const [content, setContent] = useState("");
=======
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState("");

<<<<<<< HEAD
  // Predefined options for AI-compatible tags
  const themeOptions = [
    "Family",
    "Love",
    "Adventure",
    "Career",
    "Education",
    "Travel",
    "Celebration",
    "Loss",
    "Growth",
    "Friendship",
    "Achievement",
    "Challenge",
    "Tradition",
    "Heritage",
  ];

  const emotionOptions = [
    "Joy",
    "Sadness",
    "Love",
    "Pride",
    "Nostalgia",
    "Gratitude",
    "Hope",
    "Fear",
    "Excitement",
    "Peace",
    "Surprise",
    "Contentment",
    "Wonder",
    "Courage",
  ];

  const timePeriodOptions = [
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

  const lifeStageOptions = [
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

  useEffect(() => {
    if (storyId) {
      loadStoryForEdit();
    }
  }, [storyId]);

  const loadStoryForEdit = async () => {
    try {
      setInitialLoading(true);
      const story = await getStoryById(storyId);
      setTitle(story.title || "");
      setContent(story.content || "");

      // Load old tags if they exist
      setTags(story.tags || []);

      // Load new structured tags if they exist (from AI analysis or manual entry)
      if (story.analysis) {
        setSelectedThemes(story.analysis.themes || []);
        setSelectedEmotions(story.analysis.emotions || []);
        setSelectedTimePeriod(story.analysis.timePeriod || "");
        setSelectedLifeStage(story.analysis.lifeStage || "");
      }

      setDate(
        story.date || story.eventDate
          ? new Date(story.date || story.eventDate).toISOString().split("T")[0]
          : ""
      );
      setExistingMedia(story.media || []);
      setIsEditMode(true);
    } catch (err) {
      console.error("Error loading story:", err);
      setError("Failed to load story for editing");
    } finally {
      setInitialLoading(false);
    }
  };

  // Keep old tag functionality for backward compatibility
=======
  useEffect(() => {
    if (storyId) {
      setIsEditMode(true);
      const loadStoryForEdit = async () => {
        try {
          setInitialLoading(true);
          const story = await getStoryById(storyId);
          setTitle(story.title || "");
          setContent(story.content || "");
          setTags(story.tags || []);
          setDate(
            story.eventDate
              ? new Date(story.eventDate).toISOString().split("T")[0]
              : ""
          );
          setExistingMedia(story.media || []);
        } catch (err) {
          console.error("Error loading story:", err);
          setError("Failed to load story for editing");
        } finally {
          setInitialLoading(false);
        }
      };
      loadStoryForEdit();
    }
  }, [storyId]);
  
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newMedia = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      file: file,
    }));
<<<<<<< HEAD
    setUploadedMedia([...uploadedMedia, ...newMedia]);
=======
    setUploadedMedia((prev) => [...prev, ...newMedia]);
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
  };

  const handleRemoveMedia = (id) => {
    const media = uploadedMedia.find((m) => m.id === id);
    if (media?.url) {
      URL.revokeObjectURL(media.url);
    }
<<<<<<< HEAD
    setUploadedMedia(uploadedMedia.filter((media) => media.id !== id));
  };

  // Replace the handleSave function in StoryEditor.jsx with this:

const handleSave = async () => {
  if (!title.trim()) {
    setError("Please enter a title for your story");
    return;
  }

  if (!content.trim()) {
    setError("Please write some content for your story");
    return;
  }

  setLoading(true);
  setError("");

  try {
    // ✅ FIXED: Combine all tags into the tags array
    const combinedTags = [
      ...tags, // Custom tags
      ...selectedThemes,
      ...selectedEmotions,
      ...(selectedTimePeriod ? [selectedTimePeriod] : []),
      ...(selectedLifeStage ? [selectedLifeStage] : []),
    ];

    const storyData = {
      title,
      content,
      eventDate: date || new Date().toISOString(),
      tags: combinedTags, // ✅ This will be saved to MongoDB
    };

    console.log("💾 Saving story with data:", storyData);

    if (isEditMode && storyId) {
      const updatedStory = await updateStory(storyId, storyData);

      if (uploadedMedia.length > 0) {
        try {
          await Promise.all(
            uploadedMedia.map((media) => uploadMedia(storyId, media.file, ""))
          );
        } catch (mediaErr) {
          console.error("Media upload failed:", mediaErr);
          setError(
            `Story updated but some media files failed to upload: ${
              mediaErr.response?.data?.message || mediaErr.message
            }`
          );
          setTimeout(() => navigate(`/story-detail/${storyId}`), 3000);
          return;
        }
      }

      navigate(`/story-detail/${storyId}`);
    } else {
      const newStory = await createStory(storyData);

      if (uploadedMedia.length > 0) {
        try {
          await Promise.all(
            uploadedMedia.map((media) =>
              uploadMedia(newStory._id, media.file, "")
            )
          );
        } catch (mediaErr) {
          console.error("Media upload failed:", mediaErr);
          setError(
            `Story created but some media files failed to upload: ${
              mediaErr.response?.data?.message || mediaErr.message
            }`
          );
          setTimeout(() => navigate("/timeline"), 3000);
          return;
        }
      }

      navigate("/timeline");
    }
  } catch (err) {
    console.error("Error saving story:", err);
    const errorMessage =
      err.response?.data?.message || err.message || "Failed to save story";
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};
  const getMediaIcon = (type) => {
    if (type.startsWith("image/")) return <Image />;
    if (type.startsWith("video/")) return <VideoLibrary />;
    if (type.startsWith("audio/")) return <AudioFile />;
    return <CloudUpload />;
=======
    setUploadedMedia((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const storyData = {
        title,
        content,
        eventDate: date || new Date().toISOString(),
        tags: tags,
      };

      let savedStoryId = storyId;

      if (isEditMode) {
        const updatedStory = await updateStory(storyId, storyData);
        savedStoryId = updatedStory._id;
      } else {
        const newStory = await createStory(storyData);
        savedStoryId = newStory._id;
      }

      if (uploadedMedia.length > 0) {
        await Promise.all(
          uploadedMedia.map((media) =>
            uploadMedia(savedStoryId, media.file, "")
          )
        );
      }
      
      navigate(isEditMode ? `/story-detail/${savedStoryId}` : "/timeline");

    } catch (err) {
      console.error("Error saving story:", err);
      setError(err.response?.data?.message || "Failed to save story");
    } finally {
      setLoading(false);
    }
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
  };

  if (initialLoading) {
    return (
<<<<<<< HEAD
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
=======
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
        <CircularProgress />
      </Box>
    );
  }

  return (
<<<<<<< HEAD
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#faf6f1",
      }}
    >
      {/* Top Bar */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title="Go back">
            <IconButton
              onClick={() =>
                navigate(isEditMode ? `/story-detail/${storyId}` : "/timeline")
              }
              disabled={loading}
            >
=======
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "#faf6f1" }}>
      {/* Top Bar */}
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.08)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title="Go back">
            <IconButton onClick={() => navigate(isEditMode ? `/story-detail/${storyId}` : "/timeline")} disabled={loading}>
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" fontWeight={700} color="text.primary">
<<<<<<< HEAD
            ✏️ {isEditMode ? "Edit Story" : "Create New Story"}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Cancel />}
            onClick={() =>
              navigate(isEditMode ? `/story-detail/${storyId}` : "/timeline")
            }
            disabled={loading}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={18} /> : <Save />}
            onClick={handleSave}
            disabled={loading}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              bgcolor: "orange",
              "&:hover": { bgcolor: "#e69500" },
              minWidth: 140,
            }}
          >
=======
            ✍️ {isEditMode ? "Edit Story" : "Create New Story"}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" color="error" startIcon={<Cancel />} onClick={() => navigate(isEditMode ? `/story-detail/${storyId}` : "/timeline")} disabled={loading} sx={{ borderRadius: 2, textTransform: "none" }}>
            Cancel
          </Button>
          <Button variant="contained" startIcon={loading ? <CircularProgress size={18} /> : <Save />} onClick={handleSave} disabled={loading} sx={{ borderRadius: 2, textTransform: "none", bgcolor: "orange", "&:hover": { bgcolor: "#e69500" }, minWidth: 140 }}>
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
            {loading ? "Saving..." : isEditMode ? "Update Story" : "Save Story"}
          </Button>
        </Stack>
      </Box>

<<<<<<< HEAD
      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{ m: 2, borderRadius: 2 }}
        >
=======
      {error && (
        <Alert severity="error" onClose={() => setError("")} sx={{ m: 2, borderRadius: 2 }}>
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
          {error}
        </Alert>
      )}

      {/* Middle Content */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left Panel */}
<<<<<<< HEAD
        <Box
          sx={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid",
            borderColor: "divider",
            bgcolor: "white",
          }}
        >
          {/* Title + Date */}
          <Box sx={{ p: 2, display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your story a title..."
              InputProps={{
                sx: {
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: "#fdfdfd",
                },
              }}
            />
            <TextField
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              sx={{
                minWidth: 160,
                borderRadius: 2,
                bgcolor: "#fdfdfd",
              }}
            />
          </Box>

          {/* Toolbar */}
          <Box
            sx={{
              px: 2,
              py: 1,
              borderTop: "1px solid",
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              gap: 1,
              bgcolor: "#f9f9f9",
              alignItems: "center",
            }}
          >
            <Tooltip title="Bold">
              <IconButton>
                <FormatBold />
              </IconButton>
            </Tooltip>
            <Tooltip title="Italic">
              <IconButton>
                <FormatItalic />
              </IconButton>
            </Tooltip>
            <Tooltip title="Bullet List">
              <IconButton>
                <FormatListBulleted />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Typography variant="caption" color="text.secondary">
              {content.length} characters
            </Typography>
          </Box>

          {/* Content Area */}
          <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
            <TextField
              fullWidth
              multiline
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your story here..."
              minRows={18}
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: "1rem",
                  fontFamily: "Georgia, serif",
                  lineHeight: 1.6,
                },
                "& fieldset": { border: "none" },
              }}
            />
          </Box>
        </Box>

        {/* Right Panel - UPDATED WITH NEW TAG SECTIONS */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            bgcolor: "white",
            overflow: "auto",
          }}
        >
          {/* AI-Compatible Tags Section */}
          <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              gutterBottom
              color="primary"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <LocalOffer /> Story Tags (AI Search Compatible)
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 2, display: "block" }}
            >
              Add tags to make your story discoverable with AI Smart Search
            </Typography>

            {/* Themes */}
            <Box sx={{ mb: 2 }}>
              <Autocomplete
                multiple
                size="small"
                options={themeOptions}
                value={selectedThemes}
                onChange={(e, newValue) => setSelectedThemes(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Themes"
                    placeholder="Select themes..."
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      color="primary"
                      size="small"
                    />
                  ))
                }
              />
            </Box>

            {/* Emotions */}
            <Box sx={{ mb: 2 }}>
              <Autocomplete
                multiple
                size="small"
                options={emotionOptions}
                value={selectedEmotions}
                onChange={(e, newValue) => setSelectedEmotions(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Emotions"
                    placeholder="Select emotions..."
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      color="secondary"
                      size="small"
                    />
                  ))
                }
              />
            </Box>

            {/* Time Period & Life Stage - FULL WIDTH */}
            <Stack spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Time Period</InputLabel>
                <Select
                  value={selectedTimePeriod}
                  label="Time Period"
                  onChange={(e) => setSelectedTimePeriod(e.target.value)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {timePeriodOptions.map((period) => (
                    <MenuItem key={period} value={period}>
                      {period}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Life Stage</InputLabel>
                <Select
                  value={selectedLifeStage}
                  label="Life Stage"
                  onChange={(e) => setSelectedLifeStage(e.target.value)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {lifeStageOptions.map((stage) => (
                    <MenuItem key={stage} value={stage}>
                      {stage}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Box>

          {/* Old Tags (Keep for backward compatibility) */}
          <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              gutterBottom
              color="text.secondary"
            >
              🏷️ Custom Tags (Optional)
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Add custom tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
=======
        <Box sx={{ flex: 2, display: "flex", flexDirection: "column", borderRight: "1px solid", borderColor: "divider", bgcolor: "white" }}>
          <Box sx={{ p: 2, display: "flex", gap: 2 }}>
            <TextField fullWidth variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your story a title..." InputProps={{ sx: { fontSize: "1.6rem", fontWeight: 700, borderRadius: 2, bgcolor: "#fdfdfd" } }} />
            <TextField type="date" value={date} onChange={(e) => setDate(e.target.value)} sx={{ minWidth: 160, borderRadius: 2, bgcolor: "#fdfdfd" }} />
          </Box>
          <Box sx={{ px: 2, py: 1, borderTop: "1px solid", borderBottom: "1px solid", borderColor: "divider", display: "flex", gap: 1, bgcolor: "#f9f9f9", alignItems: "center" }}>
            <Tooltip title="Bold"><IconButton><FormatBold /></IconButton></Tooltip>
            <Tooltip title="Italic"><IconButton><FormatItalic /></IconButton></Tooltip>
            <Tooltip title="Bullet List"><IconButton><FormatListBulleted /></IconButton></Tooltip>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Typography variant="caption" color="text.secondary">{content.length} characters</Typography>
          </Box>
          <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
            <TextField fullWidth multiline value={content} onChange={(e) => setContent(e.target.value)} placeholder="Start writing your story here..." minRows={18} sx={{ "& .MuiInputBase-input": { fontSize: "1rem", fontFamily: "Georgia, serif", lineHeight: 1.6 }, "& fieldset": { border: "none" } }} />
          </Box>
        </Box>

        {/* Right Panel */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", bgcolor: "white", overflow: "hidden" }}>
          {/* Tags Section */}
          <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">🏷️ Tags</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Add tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              sx={{ borderRadius: 2, bgcolor: "#fdfdfd" }}
            />
            <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  color="warning"
                  variant="outlined"
<<<<<<< HEAD
                  size="small"
=======
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
                  sx={{ borderRadius: "12px" }}
                />
              ))}
            </Stack>
          </Box>
<<<<<<< HEAD

          {/* Existing Media (Edit Mode) */}
          {isEditMode && existingMedia.length > 0 && (
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                maxHeight: "30%",
                overflow: "auto",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                color="text.primary"
              >
                🔎 Existing Media
              </Typography>
              <Grid container spacing={2}>
                {existingMedia.map((media, index) => (
                  <Grid item xs={6} key={index}>
                    <Card
                      sx={{
                        borderRadius: 2,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      }}
                    >
                      {(media.type === "image" ||
                        media.mimeType?.startsWith("image/")) && (
                        <CardMedia
                          component="img"
                          height="100"
                          image={media.url || media.fileUrl}
                          alt={media.description || "Story media"}
                        />
=======
          
          {/* Existing Media (Edit Mode) */}
          {isEditMode && existingMedia.length > 0 && (
            <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider", maxHeight: "30%", overflow: "auto" }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">📎 Existing Media</Typography>
              <Grid container spacing={2}>
                {existingMedia.map((media, index) => (
                  <Grid item xs={6} key={index}>
                    <Card sx={{ borderRadius: 2, boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
                      {(media.mediaType === "photo") && (
                        <CardMedia component="img" height="100" image={media.fileUrl} alt={media.description} />
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

<<<<<<< HEAD
          {/* Media Upload */}
          <Box sx={{ flex: 1, p: 2, overflow: "auto" }}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              gutterBottom
              color="text.primary"
            >
              🖼️ {isEditMode ? "Add New Media" : "Media"}
            </Typography>
            <Box
              sx={{
                border: "2px dashed #ccc",
                borderRadius: 3,
                p: 3,
                textAlign: "center",
                bgcolor: "#fafafa",
                cursor: "pointer",
                transition: "all 0.3s",
                "&:hover": {
                  borderColor: "orange",
                  bgcolor: "#fff8f0",
                },
              }}
            >
              <input
                accept="image/*,video/*,audio/*"
                style={{ display: "none" }}
                id="media-upload"
                multiple
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="media-upload" style={{ cursor: "pointer" }}>
                <CloudUpload sx={{ fontSize: 40, color: "orange", mb: 1 }} />
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Upload Photos, Videos, or Audio
                </Typography>
=======
          {/* Media Upload Section */}
          <Box sx={{ flex: 1, p: 2, overflow: "auto" }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">🖼️ {isEditMode ? "Add New Media" : "Media"}</Typography>
            <Box sx={{ border: "2px dashed #ccc", borderRadius: 3, p: 3, textAlign: "center", bgcolor: "#fafafa", cursor: "pointer", transition: "all 0.3s", "&:hover": { borderColor: "orange", bgcolor: "#fff8f0" } }}>
              <input accept="image/*,video/*,audio/*" style={{ display: "none" }} id="media-upload" multiple type="file" onChange={handleFileUpload} />
              <label htmlFor="media-upload" style={{ cursor: "pointer" }}>
                <CloudUpload sx={{ fontSize: 40, color: "orange", mb: 1 }} />
                <Typography variant="body2" fontWeight={600} color="text.secondary">Upload Photos, Videos, or Audio</Typography>
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
              </label>
            </Box>
            {uploadedMedia.length > 0 && (
              <Grid container spacing={2} mt={2}>
                {uploadedMedia.map((media) => (
                  <Grid item xs={6} key={media.id}>
<<<<<<< HEAD
                    <Card
                      sx={{
                        position: "relative",
                        borderRadius: 2,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      }}
                    >
                      {media.type.startsWith("image/") && (
                        <CardMedia
                          component="img"
                          height="120"
                          image={media.url}
                          alt={media.name}
                        />
                      )}
                      {media.type.startsWith("video/") && (
                        <CardMedia
                          component="video"
                          height="120"
                          src={media.url}
                          controls
                        />
                      )}
                      {media.type.startsWith("audio/") && (
                        <Box sx={{ p: 2 }}>🎵 {media.name}</Box>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveMedia(media.id)}
                        sx={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          bgcolor: "rgba(0,0,0,0.6)",
                          color: "white",
                          "&:hover": { bgcolor: "error.main" },
                        }}
                      >
=======
                    <Card sx={{ position: "relative", borderRadius: 2, boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
                      {media.type.startsWith("image/") && <CardMedia component="img" height="120" image={media.url} alt={media.name} />}
                      {media.type.startsWith("video/") && <CardMedia component="video" height="120" src={media.url} controls />}
                      {media.type.startsWith("audio/") && <Box sx={{ p: 2 }}>🎵 {media.name}</Box>}
                      <IconButton size="small" onClick={() => handleRemoveMedia(media.id)} sx={{ position: "absolute", top: 6, right: 6, bgcolor: "rgba(0,0,0,0.6)", color: "white", "&:hover": { bgcolor: "error.main" } }}>
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
                        <Close fontSize="small" />
                      </IconButton>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

<<<<<<< HEAD
export default StoryEditor;
=======
export default StoryEditor;
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
