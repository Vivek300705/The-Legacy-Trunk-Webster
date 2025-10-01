import { useState } from "react";
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

const Profile = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("John Doe");
  const [role, setRole] = useState("Family Historian");

  // Mock family connections data
  const familyConnections = {
    parents: [
      { id: 1, name: "Robert Doe", avatar: "" },
      { id: 2, name: "Mary Doe", avatar: "" },
    ],
    spouse: [{ id: 3, name: "Jane Doe", avatar: "" }],
    siblings: [
      { id: 4, name: "Sarah Doe", avatar: "" },
      { id: 5, name: "Michael Doe", avatar: "" },
    ],
  };

  // Mock recent stories data
  const recentStories = [
    {
      id: 1,
      title: "Summer Vacation 1985",
      date: "2024-03-15",
      author: "John Doe",
    },
    {
      id: 2,
      title: "Grandma's Secret Recipe",
      date: "2024-03-10",
      author: "John Doe",
    },
    {
      id: 3,
      title: "Family Reunion 2023",
      date: "2024-03-05",
      author: "John Doe",
    },
    {
      id: 4,
      title: "Childhood Memories",
      date: "2024-02-28",
      author: "John Doe",
    },
  ];

  const handlePersonClick = (personId) => {
    navigate(`/profile/${personId}`);
  };

  const handleStoryClick = (storyId) => {
    navigate(`/story-detail?id=${storyId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Paper sx={{ p: 4, mb: 4 }}>
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
              width: 150,
              height: 150,
              mb: 3,
              bgcolor: "primary.main",
              fontSize: "4rem",
            }}
          >
            {displayName.charAt(0)}
          </Avatar>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            {displayName}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {user?.email}
          </Typography>
          <Chip label={role} color="primary" size="medium" />
        </Box>

        {/* Profile Information */}
        <Box sx={{ maxWidth: 500, mx: "auto", mb: 3 }}>
          <TextField
            fullWidth
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={!isEditing}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={!isEditing}
            sx={{ mb: 2 }}
          />
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
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
                variant="contained"
                startIcon={<Save />}
                onClick={() => setIsEditing(false)}
                size="large"
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => setIsEditing(false)}
                size="large"
              >
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Paper>

      {/* Family Connections and Recent Stories */}
      <Grid container spacing={3}>
        {/* Family Connections */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <FamilyRestroom
                  sx={{ fontSize: 32, color: "primary.main", mr: 1 }}
                />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Family Connections
                </Typography>
              </Box>

              {/* Parents */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}
                >
                  Parents
                </Typography>
                <List>
                  {familyConnections.parents.map((parent) => (
                    <ListItem
                      key={parent.id}
                      button
                      onClick={() => handlePersonClick(parent.id)}
                      sx={{ borderRadius: 1, mb: 1 }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          {parent.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={parent.name} />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Spouse */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}
                >
                  Spouse
                </Typography>
                <List>
                  {familyConnections.spouse.map((spouse) => (
                    <ListItem
                      key={spouse.id}
                      button
                      onClick={() => handlePersonClick(spouse.id)}
                      sx={{ borderRadius: 1, mb: 1 }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          {spouse.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={spouse.name} />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Siblings */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}
                >
                  Siblings
                </Typography>
                <List>
                  {familyConnections.siblings.map((sibling) => (
                    <ListItem
                      key={sibling.id}
                      button
                      onClick={() => handlePersonClick(sibling.id)}
                      sx={{ borderRadius: 1, mb: 1 }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          {sibling.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={sibling.name} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Stories */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <AutoStories
                  sx={{ fontSize: 32, color: "primary.main", mr: 1 }}
                />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Recent Stories
                </Typography>
              </Box>

              <List>
                {recentStories.map((story) => (
                  <ListItem
                    key={story.id}
                    button
                    onClick={() => handleStoryClick(story.id)}
                    sx={{
                      borderRadius: 1,
                      mb: 2,
                      border: 1,
                      borderColor: "divider",
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
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
                          <Typography variant="body2" color="text.secondary">
                            By {story.author}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(story.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/timeline")}
                sx={{ mt: 2 }}
              >
                View All Stories
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
