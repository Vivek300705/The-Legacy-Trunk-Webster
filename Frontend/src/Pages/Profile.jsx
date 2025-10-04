import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Avatar,
  Typography,
  Box,
  TextField,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import {
  Edit,
  Save,
  Cancel,
  FamilyRestroom,
  AutoStories,
  ArrowForward,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserOwnStories } from "../api/services";
import api from "../api/axiosConfig";

const Profile = () => {
  const navigate = useNavigate();
  const firebaseUser = useSelector((state) => state.auth.firebaseUser);
  const mongoUser = useSelector((state) => state.auth.mongoUser);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [userData, setUserData] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [originalRole, setOriginalRole] = useState("");

  const [relationships, setRelationships] = useState({
    parents: [],
    children: [],
    spouse: [],
    siblings: [],
    grandparents: [],
    grandchildren: [],
  });

  const [recentStories, setRecentStories] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const profileResponse = await api.get("/user/profile");
        const profile = profileResponse.data;
        setUserData(profile);
        setDisplayName(profile.name || "");
        setOriginalName(profile.name || "");
        setRole(profile.role || "");
        setOriginalRole(profile.role || "");

        const relationshipsResponse = await api.get("/relationships/approved");
        setRelationships(relationshipsResponse.data);

        const stories = await getUserOwnStories(6, 0);
        setRecentStories(stories.stories || []);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    if (mongoUser) fetchProfileData();
  }, [mongoUser]);

  const handleSaveProfile = async () => {
    try {
      setError("");
      setSuccess("");
      const response = await api.put("/user/profile", {
        name: displayName,
        role,
      });
      setUserData(response.data);
      setOriginalName(displayName);
      setOriginalRole(role);
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
    }
  };

  const handleCancelEdit = () => {
    setDisplayName(originalName);
    setRole(originalRole);
    setIsEditing(false);
    setError("");
  };

  const handleStoryClick = (storyId) => navigate(`/story-detail/${storyId}`);

  if (loading) return <Typography sx={{ p: 4 }}>Loading...</Typography>;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#FAFAFA", py: 4 }}>
      <Container maxWidth="lg">
        {/* Top Section - Profile Card */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 3,
            borderRadius: 3,
            border: "1px solid #E0E0E0",
          }}
        >
          <Grid container spacing={4}>
            {/* Left - Avatar and Basic Info */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar
                  sx={{
                    width: 150,
                    height: 150,
                    mb: 2,
                    bgcolor: "primary.main",
                    fontSize: "4rem",
                    boxShadow: 3,
                  }}
                >
                  {displayName?.charAt(0) || "U"}
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {displayName}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {mongoUser?.email}
                </Typography>
                {role && (
                  <Chip
                    label={role}
                    color="primary"
                    sx={{ fontWeight: 500, px: 2 }}
                  />
                )}
              </Box>
            </Grid>

            {/* Right - Edit Form */}
            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                  Profile Information
                </Typography>

                <Grid container spacing={2} sx={{ flex: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Display Name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Role / Title"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g., Father, Grandmother"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "flex-end",
                        mt: 2,
                      }}
                    >
                      {!isEditing ? (
                        <Button
                          variant="contained"
                          startIcon={<Edit />}
                          onClick={() => setIsEditing(true)}
                          size="large"
                        >
                          Edit Profile
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="outlined"
                            startIcon={<Cancel />}
                            onClick={handleCancelEdit}
                            size="large"
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            startIcon={<Save />}
                            onClick={handleSaveProfile}
                            size="large"
                          >
                            Save Changes
                          </Button>
                        </>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Family Connections */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            border: "1px solid #E0E0E0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <FamilyRestroom
              sx={{ fontSize: 28, color: "primary.main", mr: 1.5 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Family Connections
            </Typography>
          </Box>

          {!relationships.parents?.length &&
          !relationships.spouse?.length &&
          !relationships.siblings?.length ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 4 }}
            >
              No family connections yet. Start building your family tree!
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {relationships.parents?.length > 0 && (
                <Grid item xs={12} sm={4}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1.5, fontWeight: 600, color: "text.secondary" }}
                  >
                    Parents ({relationships.parents.length})
                  </Typography>
                  <Stack spacing={1}>
                    {relationships.parents.map((person) => (
                      <Box
                        key={person._id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1.5,
                          borderRadius: 2,
                          border: "1px solid #E0E0E0",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          "&:hover": {
                            backgroundColor: "#F5F5F5",
                            transform: "translateX(4px)",
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 36,
                            height: 36,
                          }}
                        >
                          {person.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {person.name}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Grid>
              )}

              {relationships.spouse?.length > 0 && (
                <Grid item xs={12} sm={4}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1.5, fontWeight: 600, color: "text.secondary" }}
                  >
                    Spouse
                  </Typography>
                  <Stack spacing={1}>
                    {relationships.spouse.map((person) => (
                      <Box
                        key={person._id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1.5,
                          borderRadius: 2,
                          border: "1px solid #E0E0E0",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          "&:hover": {
                            backgroundColor: "#F5F5F5",
                            transform: "translateX(4px)",
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "secondary.main",
                            width: 36,
                            height: 36,
                          }}
                        >
                          {person.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {person.name}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Grid>
              )}

              {relationships.siblings?.length > 0 && (
                <Grid item xs={12} sm={4}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1.5, fontWeight: 600, color: "text.secondary" }}
                  >
                    Siblings ({relationships.siblings.length})
                  </Typography>
                  <Stack spacing={1}>
                    {relationships.siblings.map((person) => (
                      <Box
                        key={person._id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1.5,
                          borderRadius: 2,
                          border: "1px solid #E0E0E0",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          "&:hover": {
                            backgroundColor: "#F5F5F5",
                            transform: "translateX(4px)",
                          },
                        }}
                      >
                        <Avatar
                          sx={{ bgcolor: "info.main", width: 36, height: 36 }}
                        >
                          {person.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {person.name}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Grid>
              )}
            </Grid>
          )}
        </Paper>

        {/* Recent Stories - Horizontal Scroll */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid #E0E0E0",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AutoStories
                sx={{ fontSize: 28, color: "primary.main", mr: 1.5 }}
              />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Recent Stories
              </Typography>
            </Box>
            <Button
              endIcon={<ArrowForward />}
              onClick={() => navigate("/timeline")}
              sx={{ textTransform: "none" }}
            >
              View All
            </Button>
          </Box>

          {recentStories.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                overflowX: "auto",
                pb: 2,
                "&::-webkit-scrollbar": {
                  height: 8,
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#F5F5F5",
                  borderRadius: 4,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#BDBDBD",
                  borderRadius: 4,
                  "&:hover": {
                    backgroundColor: "#9E9E9E",
                  },
                },
              }}
            >
              {recentStories.map((story) => (
                <Card
                  key={story._id}
                  onClick={() => handleStoryClick(story._id)}
                  sx={{
                    minWidth: 280,
                    maxWidth: 280,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    border: "1px solid #E0E0E0",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  {story.media && story.media.length > 0 && (
                    <Box
                      component="img"
                      src={story.media[0].fileUrl || story.media[0].url}
                      alt={story.title}
                      sx={{
                        width: "100%",
                        height: 160,
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {story.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {story.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(
                        story.date || story.createdAt
                      ).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 6,
                backgroundColor: "#F5F5F5",
                borderRadius: 2,
              }}
            >
              <AutoStories sx={{ fontSize: 60, color: "#BDBDBD", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No stories yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Start sharing your family memories
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/story-editor")}
              >
                Create Your First Story
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;
