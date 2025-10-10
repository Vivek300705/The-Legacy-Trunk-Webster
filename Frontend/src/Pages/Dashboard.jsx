import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import {
  Add,
  Group,
  AutoStories,
  Timeline,
  FamilyRestroom,
<<<<<<< HEAD
=======
  Download, // 👈 1. Import the Download icon
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import api from "../api/axiosConfig";
import { setMongoUser } from "../store/slice/authSlice";
<<<<<<< HEAD
import MemoryPrompt from '../components/MemoryPrompt'; // 👈 1. Import the new component
=======
import MemoryPrompt from '../components/MemoryPrompt';
import { exportStoriesPDF } from "../api/services"; // 👈 2. Import the new API service
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mongoUser = useSelector((state) => state.auth.mongoUser);
  const firebaseUser = useSelector((state) => state.auth.firebaseUser);

  const [recentStories, setRecentStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
<<<<<<< HEAD
=======
  
  // 👇 3. Add state for the download button
  const [isDownloading, setIsDownloading] = useState(false);

  // 👇 4. Add the handler function for the download logic
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const blob = await exportStoriesPDF();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'family-stories.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url); // Clean up the URL object
    } catch (error) {
      console.error("Failed to download PDF:", error);
      setError("Could not export stories. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userResponse = await api.get("/user/profile");
        if (userResponse.data) {
          dispatch(setMongoUser(userResponse.data));

          if (userResponse.data?.familyCircle) {
            try {
              const storiesResponse = await api.get(
                "/stories/family-circle?limit=3"
              );
              setRecentStories(storiesResponse.data.stories || []);
            } catch (storyErr) {
              console.log("No stories found:", storyErr);
              setRecentStories([]);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
<<<<<<< HEAD
        // setError("Failed to load dashboard data");
=======
        setError("Failed to load dashboard data");
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
      } finally {
        setLoading(false);
      }
    };

    if (firebaseUser) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [firebaseUser, dispatch]);

  const isNewUser = !mongoUser?.familyCircle;
  const familyCircle = mongoUser?.familyCircle;

  const quickActions = [
    {
      icon: <AutoStories sx={{ fontSize: 40 }} />,
      title: "Add Story",
      description: "Share a new family memory",
      action: () => navigate("/story-editor"),
      disabled: isNewUser,
    },
    {
      icon: <Group sx={{ fontSize: 40 }} />,
      title: "Create Circle",
      description: "Start a new family circle",
      action: () => navigate("/family-circle/new"),
      disabled: false,
      highlighted: isNewUser,
    },
    {
      icon: <Timeline sx={{ fontSize: 40 }} />,
      title: "View Timeline",
      description: "Explore your legacy",
      action: () => navigate("/timeline"),
      disabled: isNewUser,
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

<<<<<<< HEAD
      {/* Header */}
=======
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
          Welcome back, {mongoUser?.name || "Friend"}!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Continue building your family legacy
        </Typography>
      </Box>

<<<<<<< HEAD
      {/* 👇 2. Add the MemoryPrompt component here */}
      <MemoryPrompt />

      {/* Quick Actions */}
=======
      <MemoryPrompt />

>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Quick Actions
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
            gap: 3,
          }}
        >
          {quickActions.map((action, index) => (
            <Card
              key={index}
              sx={{
                height: "100%",
                cursor: action.disabled ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                opacity: action.disabled ? 0.5 : 1,
                border: action.highlighted ? 2 : 0,
                borderColor: action.highlighted
                  ? "primary.main"
                  : "transparent",
                "&:hover": {
                  transform: action.disabled ? "none" : "translateY(-4px)",
                  boxShadow: action.disabled ? 1 : 4,
                },
              }}
              onClick={action.disabled ? null : action.action}
            >
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <Box
                  sx={{
                    color: action.highlighted
                      ? "primary.main"
                      : action.disabled
                      ? "text.disabled"
                      : "primary.main",
                    mb: 2,
                  }}
                >
                  {action.icon}
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

<<<<<<< HEAD
      {/* Family Circle Section (and the rest of your page) */}
      {/* ... The rest of your existing Dashboard.jsx code remains unchanged ... */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
=======
      <Box sx={{ mb: 6 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap", // Added for responsiveness
            gap: 2, // Added for spacing
            mb: 3,
          }}
        >
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Your Family Circle
          </Typography>
          {!isNewUser && familyCircle?._id && (
<<<<<<< HEAD
            <Button
              variant="outlined"
              startIcon={<Group />}
              onClick={() => navigate(`/family-circle/${familyCircle._id}`)}
            >
              Manage Circle
            </Button>
          )}
        </Box>
=======
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Group />}
                onClick={() => navigate(`/family-circle/${familyCircle._id}`)}
              >
                Manage Circle
              </Button>
              {/* 👇 5. Add the new export button here */}
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? 'Generating...' : 'Export Stories'}
              </Button>
            </Box>
          )}
        </Box>

>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
        {isNewUser ? (
          <Card sx={{ py: 8, textAlign: "center", bgcolor: "background.paper" }}>
            <CardContent>
              <FamilyRestroom sx={{ fontSize: 120, color: "primary.main", mb: 3 }} />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Create your first family circle to start sharing memories
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: "auto" }}>
                Family circles are private spaces where you can share stories,
                photos, and memories with your loved ones.
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<Add />}
                onClick={() => navigate("/family-circle/new")}
                sx={{ px: 4, py: 1.5, fontSize: "1.1rem" }}
              >
                Create Your First Circle
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card sx={{ cursor: "pointer", transition: "all 0.3s ease", "&:hover": { transform: "translateY(-4px)", boxShadow: 4 } }} onClick={() => familyCircle?._id && navigate(`/family-circle/${familyCircle._id}`)}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Group sx={{ fontSize: 32, color: "primary.main", mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {familyCircle?.name || "My Family"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {familyCircle?.member?.length || 0} members
                  </Typography>
                </Box>
                {familyCircle?.member && familyCircle.member.length > 0 && (
                  <AvatarGroup max={4}>
                    {familyCircle.member.map((memberItem) => (
                      <Avatar key={memberItem._id} alt={memberItem.name} src={memberItem.profilePicture} sx={{ width: 32, height: 32 }}>
                        {memberItem.name?.charAt(0)}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                )}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
<<<<<<< HEAD
=======

>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
      {!isNewUser && recentStories.length > 0 && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Recent Stories
            </Typography>
            <Button
              variant="text"
              endIcon={<Timeline />}
              onClick={() => navigate("/timeline")}
            >
              View All
            </Button>
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 2 }}>
            {recentStories.map((story) => (
              <Card key={story._id} sx={{ cursor: "pointer", transition: "all 0.3s ease", "&:hover": { transform: "translateY(-4px)", boxShadow: 4 } }} onClick={() => navigate(`/story-detail/${story._id}`)}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar src={story.author?.profilePicture} sx={{ width: 32, height: 32, mr: 1 }}>
                      {story.author?.name?.charAt(0)}
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">
                      {story.author?.name}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {story.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {story.content}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {story.eventDate
                      ? new Date(story.eventDate).toLocaleDateString()
                      : new Date(story.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}
<<<<<<< HEAD
=======
      
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
    </Container>
  );
};

export default Dashboard;