import { useState, useEffect } from "react";
import {
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
  CloudUpload,
  Close,
  Save,
  ArrowBack,
  Image,
  VideoLibrary,
  AudioFile,
  Cancel,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
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
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState("");

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
    setUploadedMedia((prev) => [...prev, ...newMedia]);
  };

  const handleRemoveMedia = (id) => {
    const media = uploadedMedia.find((m) => m.id === id);
    if (media?.url) {
      URL.revokeObjectURL(media.url);
    }
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
  };

  if (initialLoading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "#faf6f1" }}>
      {/* Top Bar */}
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.08)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title="Go back">
            <IconButton onClick={() => navigate(isEditMode ? `/story-detail/${storyId}` : "/timeline")} disabled={loading}>
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            ✍️ {isEditMode ? "Edit Story" : "Create New Story"}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" color="error" startIcon={<Cancel />} onClick={() => navigate(isEditMode ? `/story-detail/${storyId}` : "/timeline")} disabled={loading} sx={{ borderRadius: 2, textTransform: "none" }}>
            Cancel
          </Button>
          <Button variant="contained" startIcon={loading ? <CircularProgress size={18} /> : <Save />} onClick={handleSave} disabled={loading} sx={{ borderRadius: 2, textTransform: "none", bgcolor: "orange", "&:hover": { bgcolor: "#e69500" }, minWidth: 140 }}>
            {loading ? "Saving..." : isEditMode ? "Update Story" : "Save Story"}
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError("")} sx={{ m: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Middle Content */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left Panel */}
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
                  sx={{ borderRadius: "12px" }}
                />
              ))}
            </Stack>
          </Box>
          
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
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Media Upload Section */}
          <Box sx={{ flex: 1, p: 2, overflow: "auto" }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">🖼️ {isEditMode ? "Add New Media" : "Media"}</Typography>
            <Box sx={{ border: "2px dashed #ccc", borderRadius: 3, p: 3, textAlign: "center", bgcolor: "#fafafa", cursor: "pointer", transition: "all 0.3s", "&:hover": { borderColor: "orange", bgcolor: "#fff8f0" } }}>
              <input accept="image/*,video/*,audio/*" style={{ display: "none" }} id="media-upload" multiple type="file" onChange={handleFileUpload} />
              <label htmlFor="media-upload" style={{ cursor: "pointer" }}>
                <CloudUpload sx={{ fontSize: 40, color: "orange", mb: 1 }} />
                <Typography variant="body2" fontWeight={600} color="text.secondary">Upload Photos, Videos, or Audio</Typography>
              </label>
            </Box>
            {uploadedMedia.length > 0 && (
              <Grid container spacing={2} mt={2}>
                {uploadedMedia.map((media) => (
                  <Grid item xs={6} key={media.id}>
                    <Card sx={{ position: "relative", borderRadius: 2, boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
                      {media.type.startsWith("image/") && <CardMedia component="img" height="120" image={media.url} alt={media.name} />}
                      {media.type.startsWith("video/") && <CardMedia component="video" height="120" src={media.url} controls />}
                      {media.type.startsWith("audio/") && <Box sx={{ p: 2 }}>🎵 {media.name}</Box>}
                      <IconButton size="small" onClick={() => handleRemoveMedia(media.id)} sx={{ position: "absolute", top: 6, right: 6, bgcolor: "rgba(0,0,0,0.6)", color: "white", "&:hover": { bgcolor: "error.main" } }}>
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

export default StoryEditor;