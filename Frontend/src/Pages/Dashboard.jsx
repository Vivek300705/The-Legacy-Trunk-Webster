import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
} from "@mui/material";
import {
  Add,
  Group,
  AutoStories,
  Timeline,
  FamilyRestroom,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  // Mock data - replace with actual data from backend
  const familyCircles = [];
  const isNewUser = familyCircles.length === 0;

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
          Welcome back, {user?.email?.split("@")[0] || "Friend"}!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Continue building your family legacy
        </Typography>
      </Box>

      {/* Quick Actions */}
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

      {/* Family Circles */}
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Your Family Circles
          </Typography>
          {!isNewUser && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/family-circle/new")}
            >
              New Circle
            </Button>
          )}
        </Box>

        {isNewUser ? (
          <Card
            sx={{ py: 8, textAlign: "center", bgcolor: "background.paper" }}
          >
            <CardContent>
              <FamilyRestroom
                sx={{ fontSize: 120, color: "primary.main", mb: 3 }}
              />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Create your first family circle to start sharing memories
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: 500, mx: "auto" }}
              >
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
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            {familyCircles.map((circle) => (
              <Card
                key={circle.id}
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
                onClick={() => navigate(`/family-circle/${circle.id}`)}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Group
                      sx={{ fontSize: 32, color: "primary.main", mr: 2 }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {circle.name}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {circle.members} members
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {circle.stories} stories shared
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/family-circle/${circle.id}`);
                    }}
                  >
                    View Circle
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/story-editor");
                    }}
                  >
                    Add Story
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
