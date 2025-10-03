import { useState, useEffect } from "react";
import {
  Container,
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
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  CloudUpload,
  Close,
  Save,
  ArrowBack,
  Image,
  VideoLibrary,
  AudioFile,
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
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [content, setContent] = useState("");
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState("");

  // Load existing story if editing
  useEffect(() => {
    if (storyId) {
      loadStoryForEdit();
    }
  }, [storyId]);

  const loadStoryForEdit = async () => {
    try {
      setInitialLoading(true);
      console.log("Loading story for editing:", storyId);
      const story = await getStoryById(storyId);
      console.log("Story loaded:", story);

      setTitle(story.title || "");
      setContent(story.content || "");
      setTags(story.tags || []);
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
    setUploadedMedia([...uploadedMedia, ...newMedia]);
  };

  const handleRemoveMedia = (id) => {
    const media = uploadedMedia.find((m) => m.id === id);
    if (media?.url) {
      URL.revokeObjectURL(media.url);
    }
    setUploadedMedia(uploadedMedia.filter((media) => media.id !== id));
  };

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
      const storyData = {
        title,
        content,
        eventDate: date || new Date().toISOString(),
        tags,
      };

      if (isEditMode && storyId) {
        // Update existing story
        console.log("Updating story with data:", storyData);
        const updatedStory = await updateStory(storyId, storyData);
        console.log("Story updated successfully:", updatedStory);

        // Upload new media if any
        if (uploadedMedia.length > 0) {
          console.log(`Uploading ${uploadedMedia.length} new media files...`);
          try {
            await Promise.all(
              uploadedMedia.map((media, index) => {
                console.log(`Uploading file ${index + 1}:`, media.name);
                return uploadMedia(storyId, media.file, "");
              })
            );
            console.log("All new media uploaded successfully");
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

        // Navigate to the updated story detail page
        navigate(`/story-detail/${storyId}`);
      } else {
        // Create new story
        console.log("Creating story with data:", storyData);
        const newStory = await createStory(storyData);
        console.log("Story created successfully:", newStory);

        // Upload media if any
        if (uploadedMedia.length > 0) {
          console.log(`Uploading ${uploadedMedia.length} media files...`);
          try {
            await Promise.all(
              uploadedMedia.map((media, index) => {
                console.log(`Uploading file ${index + 1}:`, media.name);
                return uploadMedia(newStory._id, media.file, "");
              })
            );
            console.log("All media uploaded successfully");
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

        // Navigate to timeline
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
  };

  if (initialLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#FAFAFA",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: "white",
          py: 2,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Tooltip title="Go back">
                <IconButton
                  onClick={() =>
                    navigate(
                      isEditMode ? `/story-detail/${storyId}` : "/timeline"
                    )
                  }
                  disabled={loading}
                  sx={{ color: "text.secondary" }}
                >
                  <ArrowBack />
                </IconButton>
              </Tooltip>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {isEditMode ? "Edit Story" : "Create New Story"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {isEditMode
                    ? "Update your family's memory"
                    : "Share your family's precious memories"}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() =>
                  navigate(
                    isEditMode ? `/story-detail/${storyId}` : "/timeline"
                  )
                }
                disabled={loading}
                sx={{ minWidth: 100 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={18} /> : <Save />}
                onClick={handleSave}
                disabled={loading}
                sx={{
                  px: 3,
                  minWidth: 140,
                  background:
                    "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                  boxShadow: "0 3px 5px 2px rgba(33, 150, 243, .3)",
                }}
              >
                {loading
                  ? "Saving..."
                  : isEditMode
                  ? "Update Story"
                  : "Publish Story"}
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, py: 4, overflow: "auto" }}>
        <Container maxWidth="xl">
          {error && (
            <Alert severity="error" onClose={() => setError("")} sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Main Editor */}
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                {/* Title Card */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      fontWeight: 600,
                      color: "primary.main",
                      letterSpacing: 1,
                    }}
                  >
                    Story Title *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Give your story a memorable title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    variant="standard"
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        fontSize: "1.75rem",
                        fontWeight: 600,
                        fontFamily: "Georgia, serif",
                      },
                    }}
                  />
                </Paper>

                {/* Content Editor */}
                <Paper
                  elevation={0}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  {/* Toolbar */}
                  <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                      backgroundColor: "#F5F5F5",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      gap: 0.5,
                    }}
                  >
                    <Tooltip title="Bold">
                      <IconButton size="small">
                        <FormatBold fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Italic">
                      <IconButton size="small">
                        <FormatItalic fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Bullet List">
                      <IconButton size="small">
                        <FormatListBulleted fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                    <Typography
                      variant="caption"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "text.secondary",
                        ml: 1,
                      }}
                    >
                      {content.length} characters
                    </Typography>
                  </Box>

                  {/* Text Area */}
                  <TextField
                    fullWidth
                    multiline
                    rows={18}
                    placeholder="Start writing your story here... Share the details, emotions, and memories that make this moment special."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    sx={{
                      "& .MuiInputBase-root": {
                        p: 3,
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "1.1rem",
                        lineHeight: 1.8,
                        fontFamily: "Georgia, serif",
                      },
                      "& fieldset": { border: "none" },
                    }}
                  />
                </Paper>
              </Stack>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                {/* Story Details */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2.5 }}>
                    Story Details
                  </Typography>

                  <Stack spacing={2.5}>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, mb: 1, display: "block" }}
                      >
                        EVENT DATE
                      </Typography>
                      <TextField
                        fullWidth
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, mb: 1, display: "block" }}
                      >
                        TAGS
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Add tag and press Enter"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        size="small"
                      />
                      {tags.length > 0 && (
                        <Stack
                          direction="row"
                          flexWrap="wrap"
                          gap={0.5}
                          mt={1.5}
                        >
                          {tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              onDelete={() => handleDeleteTag(tag)}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      )}
                    </Box>
                  </Stack>
                </Paper>

                {/* Existing Media (Edit Mode) */}
                {isEditMode && existingMedia.length > 0 && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Existing Media
                    </Typography>
                    <Stack spacing={1.5}>
                      <Typography variant="caption" color="text.secondary">
                        {existingMedia.length} file(s) attached
                      </Typography>
                      {existingMedia.map((media, index) => (
                        <Card key={index}>
                          {(media.type === "image" ||
                            media.mimeType?.startsWith("image/")) && (
                            <CardMedia
                              component="img"
                              height="100"
                              image={media.url || media.fileUrl}
                              alt={media.description || "Story media"}
                              sx={{ objectFit: "cover" }}
                            />
                          )}
                        </Card>
                      ))}
                    </Stack>
                  </Paper>
                )}

                {/* Media Upload */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    {isEditMode ? "Add New Media" : "Media Attachments"}
                  </Typography>

                  <Box
                    sx={{
                      border: "2px dashed",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 3,
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "primary.lighter",
                        transform: "scale(1.02)",
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
                    <label
                      htmlFor="media-upload"
                      style={{ cursor: "pointer", display: "block" }}
                    >
                      <CloudUpload
                        sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Upload Photos, Videos, or Audio
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Drag and drop or click to browse
                      </Typography>
                    </label>
                  </Box>

                  {uploadedMedia.length > 0 && (
                    <Stack spacing={1.5} mt={2}>
                      <Typography variant="caption" color="text.secondary">
                        {uploadedMedia.length} new file(s) to upload
                      </Typography>
                      {uploadedMedia.map((media) => (
                        <Card
                          key={media.id}
                          sx={{
                            position: "relative",
                            transition: "transform 0.2s",
                            "&:hover": {
                              transform: "scale(1.02)",
                            },
                          }}
                        >
                          {media.type.startsWith("image/") && (
                            <CardMedia
                              component="img"
                              height="100"
                              image={media.url}
                              alt={media.name}
                              sx={{ objectFit: "cover" }}
                            />
                          )}
                          {media.type.startsWith("video/") && (
                            <CardMedia
                              component="video"
                              height="100"
                              src={media.url}
                              sx={{ objectFit: "cover" }}
                            />
                          )}
                          {media.type.startsWith("audio/") && (
                            <Box
                              sx={{
                                p: 2,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                bgcolor: "#F5F5F5",
                              }}
                            >
                              {getMediaIcon(media.type)}
                              <Typography variant="caption" noWrap>
                                {media.name}
                              </Typography>
                            </Box>
                          )}
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveMedia(media.id)}
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              backgroundColor: "rgba(0,0,0,0.6)",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "error.main",
                              },
                            }}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        </Card>
                      ))}
                    </Stack>
                  )}
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default StoryEditor;
