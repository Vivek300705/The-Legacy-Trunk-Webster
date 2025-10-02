import { useState } from "react";
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
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  CloudUpload,
  Close,
  Save,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { uploadMedia, createStory } from "../api/services";

const StoryEditor = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [content, setContent] = useState("");
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      const newStory = await createStory(storyData);

      if (uploadedMedia.length > 0) {
        await Promise.all(
          uploadedMedia.map((media) =>
            uploadMedia(newStory._id, media.file, "")
          )
        );
      }

      navigate("/timeline");
    } catch (err) {
      console.error("Error saving story:", err);
      setError(err.response?.data?.message || "Failed to save story");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
          py: 2,
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
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              New Story
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/timeline")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={18} /> : <Save />}
                onClick={handleSave}
                disabled={loading}
                sx={{ px: 3, borderRadius: 2 }}
              >
                {loading ? "Saving..." : "Save Story"}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, py: 3, overflow: "hidden" }}>
        <Container maxWidth="xl" sx={{ height: "100%" }}>
          <Grid container spacing={3} sx={{ height: "100%" }}>
            {/* Sidebar */}
            <Grid item xs={12} md={3} sx={{ height: "100%", overflow: "auto" }}>
              <Stack spacing={2.5}>
                {error && (
                  <Alert severity="error" onClose={() => setError("")}>
                    {error}
                  </Alert>
                )}

                <Box>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, mb: 1, display: "block" }}
                  >
                    TITLE *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter story title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    size="small"
                    required
                  />
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, mb: 1, display: "block" }}
                  >
                    DATE
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
                    placeholder="Add tag (press Enter)"
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
                  <Stack direction="row" flexWrap="wrap" gap={0.5} mt={1}>
                    {tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleDeleteTag(tag)}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, mb: 1, display: "block" }}
                  >
                    MEDIA
                  </Typography>
                  <Box
                    sx={{
                      border: "2px dashed",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 2,
                      textAlign: "center",
                      cursor: "pointer",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "action.hover",
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
                        sx={{ fontSize: 32, color: "text.secondary" }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Click to upload
                      </Typography>
                    </label>
                  </Box>

                  {uploadedMedia.length > 0 && (
                    <Stack spacing={1} mt={1.5}>
                      {uploadedMedia.map((media) => (
                        <Card key={media.id} sx={{ position: "relative" }}>
                          {media.type.startsWith("image/") && (
                            <CardMedia
                              component="img"
                              height="60"
                              image={media.url}
                              alt={media.name}
                            />
                          )}
                          {media.type.startsWith("video/") && (
                            <CardMedia
                              component="video"
                              height="60"
                              src={media.url}
                              controls
                            />
                          )}
                          {media.type.startsWith("audio/") && (
                            <Box p={1}>
                              <audio controls style={{ width: "100%" }}>
                                <source src={media.url} type={media.type} />
                              </audio>
                            </Box>
                          )}
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveMedia(media.id)}
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              backgroundColor: "rgba(255,255,255,0.9)",
                              "&:hover": {
                                backgroundColor: "error.main",
                                color: "white",
                              },
                            }}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        </Card>
                      ))}
                    </Stack>
                  )}
                </Box>
              </Stack>
            </Grid>

            {/* Editor */}
            <Grid item xs={12} md={9} sx={{ display: "flex" }}>
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 3,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    mb: 2,
                    pb: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <IconButton size="small">
                    <FormatBold fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
                    <FormatItalic fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
                    <FormatListBulleted fontSize="small" />
                  </IconButton>
                </Stack>

                <TextField
                  fullWidth
                  multiline
                  placeholder="Start writing your story here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  sx={{
                    flex: 1,
                    "& .MuiInputBase-root": {
                      height: "100%",
                      alignItems: "flex-start",
                    },
                  }}
                  InputProps={{
                    sx: { fontSize: "1.1rem", lineHeight: 1.8 },
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default StoryEditor;
