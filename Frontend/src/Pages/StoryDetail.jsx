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
} from "@mui/material";
import {
  Person,
  CalendarToday,
  Label,
  MoreVert,
  Edit,
  Delete,
} from "@mui/icons-material";
import { getStoryById, deleteStory } from "../api/services";

const StoryDetail = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    fetchStory();
  }, [storyId]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStoryById(storyId);
      console.log("Story fetched:", data);
      setStory(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load story");
      console.error("Error fetching story:", err);
    } finally {
      setLoading(false);
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
    console.log("Navigating to edit story:", storyId);
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

          {/* Images - Instagram Carousel Style */}
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
              {images.length > 1 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    color: "white",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    fontSize: "0.875rem",
                  }}
                >
                  1/{images.length}
                </Box>
              )}
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
            {/* Title */}
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

            {/* Content */}
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

            {/* Tags */}
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

            {/* Audio Files */}
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
                      {(item.caption || item.description) && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            textAlign: "center",
                            fontStyle: "italic",
                            color: "text.secondary",
                            mt: 1,
                          }}
                        >
                          {item.caption || item.description}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Additional Images (if more than 1) */}
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
