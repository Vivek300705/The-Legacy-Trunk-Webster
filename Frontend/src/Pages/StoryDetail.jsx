import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Chip,
  Stack,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Menu,
  MenuItem,
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
          backgroundColor: "#FFFBF5",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: "100vh", py: 6, backgroundColor: "#FFFBF5" }}>
        <Container maxWidth="md">
          <Alert severity="error">{error}</Alert>
        </Container>
      </Box>
    );
  }

  if (!story) {
    return (
      <Box sx={{ minHeight: "100vh", py: 6, backgroundColor: "#FFFBF5" }}>
        <Container maxWidth="md">
          <Alert severity="info">Story not found</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", py: 6, backgroundColor: "#FFFBF5" }}>
      <Container maxWidth="md">
        <Paper
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 4,
            backgroundColor: "white",
            position: "relative",
          }}
        >
          {/* Action Menu */}
          <IconButton
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
            }}
            onClick={handleMenuOpen}
          >
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

          {/* Header */}
          <Typography
            variant="h3"
            component="h1"
            sx={{
              mb: 3,
              pr: 6,
              fontWeight: 700,
              fontFamily: "Georgia, serif",
              color: "text.primary",
              lineHeight: 1.2,
            }}
          >
            {story.title}
          </Typography>

          {/* Metadata */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              mb: 4,
              pb: 4,
              borderBottom: "2px solid",
              borderColor: "divider",
            }}
          >
            <Chip
              icon={<Person />}
              label={`By ${story.author?.name || story.author || "Anonymous"}`}
              sx={{
                backgroundColor: "primary.light",
                color: "white",
                fontWeight: 500,
              }}
            />
            <Chip
              icon={<CalendarToday />}
              label={new Date(story.date || story.createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
              variant="outlined"
              sx={{ borderColor: "primary.main", color: "text.primary" }}
            />
          </Stack>

          {/* Main Content */}
          <Box sx={{ mb: 4 }}>
            {story.content.split("\n\n").map((paragraph, index) => (
              <Typography
                key={index}
                variant="body1"
                sx={{
                  mb: 3,
                  fontSize: "1.1rem",
                  lineHeight: 1.8,
                  fontFamily: "Georgia, serif",
                  color: "text.primary",
                  textAlign: "justify",
                }}
              >
                {paragraph}
              </Typography>
            ))}
          </Box>

          {/* Media Gallery */}
          {story.media && story.media.length > 0 && (
            <Box sx={{ my: 5 }}>
              {story.media.map((item, index) => (
                <Box key={index} sx={{ mb: 4 }}>
                  {(item.type === "image" ||
                    item.mimeType?.startsWith("image/")) && (
                    <Box>
                      <Box
                        component="img"
                        src={item.url || item.fileUrl}
                        alt={item.caption || item.description}
                        sx={{
                          width: "100%",
                          borderRadius: 2,
                          boxShadow: 3,
                          mb: 1,
                        }}
                      />
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
                  )}
                  {(item.type === "video" ||
                    item.mimeType?.startsWith("video/")) && (
                    <Box>
                      <video
                        controls
                        style={{
                          width: "100%",
                          borderRadius: "8px",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        }}
                      >
                        <source
                          src={item.url || item.fileUrl}
                          type={item.mimeType || "video/mp4"}
                        />
                      </video>
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
                  )}
                  {(item.type === "audio" ||
                    item.mimeType?.startsWith("audio/")) && (
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: "background.default",
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
                            mt: 2,
                          }}
                        >
                          {item.caption || item.description}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}

          <Divider sx={{ my: 4 }} />

          {/* Tags Section */}
          {story.tags && story.tags.length > 0 && (
            <Box>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Label sx={{ color: "primary.main" }} />
                Related Tags
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {story.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    clickable
                    sx={{
                      backgroundColor: "primary.light",
                      color: "white",
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor: "primary.main",
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default StoryDetail;
