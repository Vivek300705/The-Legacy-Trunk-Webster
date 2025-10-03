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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import {
  Edit,
  Save,
  Cancel,
  FamilyRestroom,
  AutoStories,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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

        const storiesResponse = await api.get("/stories/user?limit=4");
        setRecentStories(storiesResponse.data.stories || []);
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

  const handlePersonClick = (personId) => navigate(`/profile/${personId}`);
  const handleStoryClick = (storyId) => navigate(`/story-detail?id=${storyId}`);

  const renderRelationshipSection = (title, people) => {
    if (!people || people.length === 0) return null;

    return (
      <Box>
        <Typography
          variant="subtitle2"
          sx={{ mb: 1.5, fontWeight: 600, color: "text.secondary" }}
        >
          {title}
        </Typography>
        <List sx={{ p: 0 }}>
          {people.map((person) => (
            <ListItem
              key={person.id}
              button
              onClick={() => handlePersonClick(person.id)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                px: 1.5,
                py: 1,
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <ListItemAvatar sx={{ minWidth: 40 }}>
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 32,
                    height: 32,
                    fontSize: "0.875rem",
                  }}
                >
                  {person.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={person.name}
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  if (loading) return <Typography sx={{ p: 4 }}>Loading...</Typography>;

  return (
    <Container
      maxWidth="xl"
      sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}
    >
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 120, md: 150 },
                  height: { xs: 120, md: 150 },
                  mb: 2,
                  bgcolor: "primary.main",
                  fontSize: { xs: "3rem", md: "4rem" },
                }}
              >
                {displayName?.charAt(0) || "U"}
              </Avatar>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, mb: 0.5, textAlign: "center" }}
              >
                {displayName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, textAlign: "center" }}
              >
                {user?.email}
              </Typography>
              <Chip label={role} color="primary" />
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={!isEditing}
                size="small"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={!isEditing}
                size="small"
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {!isEditing ? (
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSaveProfile}
                    >
                      Save Changes
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={3}>
            {/* Family Connections */}
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <FamilyRestroom
                      sx={{ fontSize: 28, color: "primary.main", mr: 1.5 }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Family Connections
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    {relationships.parents?.length > 0 && (
                      <Grid item xs={12} sm={6} md={4}>
                        {renderRelationshipSection(
                          "Parents",
                          relationships.parents
                        )}
                      </Grid>
                    )}
                    {relationships.spouse?.length > 0 && (
                      <Grid item xs={12} sm={6} md={4}>
                        {renderRelationshipSection(
                          "Spouse",
                          relationships.spouse
                        )}
                      </Grid>
                    )}
                    {relationships.siblings?.length > 0 && (
                      <Grid item xs={12} sm={6} md={4}>
                        {renderRelationshipSection(
                          "Siblings",
                          relationships.siblings
                        )}
                      </Grid>
                    )}
                  </Grid>

                  {!relationships.parents?.length &&
                    !relationships.spouse?.length &&
                    !relationships.siblings?.length && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center", py: 3 }}
                      >
                        No family connections yet
                      </Typography>
                    )}
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Stories */}
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <AutoStories
                      sx={{ fontSize: 28, color: "primary.main", mr: 1.5 }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Recent Stories
                    </Typography>
                  </Box>

                  {recentStories.length > 0 ? (
                    <>
                      <List sx={{ p: 0 }}>
                        {recentStories.map((story, index) => (
                          <Box key={story.id}>
                            <ListItem
                              button
                              onClick={() => handleStoryClick(story.id)}
                              sx={{
                                borderRadius: 1,
                                px: 2,
                                py: 1.5,
                                "&:hover": { bgcolor: "action.hover" },
                              }}
                            >
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: "secondary.main" }}>
                                  <AutoStories />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={story.title}
                                secondary={
                                  <Box>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      By {story.author}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {new Date(
                                        story.date
                                      ).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                }
                              />
                            </ListItem>
                            {index < recentStories.length - 1 && (
                              <Divider sx={{ my: 1 }} />
                            )}
                          </Box>
                        ))}
                      </List>

                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => navigate("/timeline")}
                        sx={{ mt: 3 }}
                      >
                        View All Stories
                      </Button>
                    </>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: "center", py: 3 }}
                    >
                      No stories yet
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
