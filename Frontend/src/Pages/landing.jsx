import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  AutoStories,
  Group,
  CloudUpload,
  Timeline,
  Download,
} from "@mui/icons-material";

const Landing = () => {
  const navigate = useNavigate();
  const firebaseUser = useSelector((state) => state.auth.firebaseUser);
  const mongoUser = useSelector((state) => state.auth.mongoUser);

  const features = [
    {
      icon: <AutoStories sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Preserve Stories",
      description: "Capture and preserve precious family memories for generations to come.",
    },
    {
      icon: <Group sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Family Circles",
      description: "Create private circles where family members can share and connect.",
    },
    {
      icon: <CloudUpload sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Rich Media",
      description: "Upload photos, videos, and audio recordings to bring stories to life.",
    },
    {
      icon: <Timeline sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Timeline View",
      description: "Organize memories chronologically and watch your legacy unfold.",
    },
    {
      icon: <Download sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Export & Share",
      description: "Download your family stories as beautiful keepsakes.",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          // 👈 Changed: Swapped the orange gradient for the new primary theme color
          background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 4,
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  fontWeight: 800,
                  color: "white",
                  mb: 2,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Your Family Legacy Lives Here
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: "rgba(255,255,255,0.95)",
                  mb: 4,
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                Preserve precious memories, share family stories, and build a
                lasting legacy for generations to treasure.
              </Typography>

              {!firebaseUser && (
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/signup")}
                    sx={{
                      // 👈 Changed: Use the vibrant secondary color for the main button
                      backgroundColor: "secondary.main",
                      color: "white",
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      "&:hover": {
                        backgroundColor: "secondary.dark",
                      },
                    }}
                  >
                    Start Your Journey
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate("/login")}
                    sx={{
                      borderColor: "white",
                      color: "white",
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      "&:hover": {
                        borderColor: "white",
                        backgroundColor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </Box>
              )}

              {firebaseUser && (
                <Typography
                  variant="h5"
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                    px: 3,
                    py: 2,
                    borderRadius: 2,
                    display: "inline-block",
                  }}
                >
                  Welcome back,{" "}
                  {mongoUser?.name || firebaseUser.email?.split("@")[0]}!
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                width: "100%",
                height: { xs: 300, md: 400 },
                borderRadius: 4,
                backgroundColor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AutoStories
                sx={{ fontSize: 120, color: "white", opacity: 0.3 }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          align="center"
          sx={{ mb: 2, fontWeight: 700, color: "text.primary" }}
        >
          Everything You Need to Preserve Your Legacy
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{ mb: 6, color: "text.secondary", fontWeight: 400 }}
        >
          Powerful tools designed for families who cherish their stories
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
            gap: 4,
          }}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              sx={{
                height: "100%",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  // 👈 Changed: Use theme's secondary color for the hover glow
                  boxShadow: (theme) => `0 12px 32px ${theme.palette.secondary.main}33`,
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* CTA Section */}
      {!firebaseUser && (
        <Box
          sx={{
            backgroundColor: "primary.main", // This will now be purple
            py: 8,
            textAlign: "center",
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h2"
              sx={{ color: "white", mb: 2, fontWeight: 700 }}
            >
              Start Building Your Legacy Today
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "rgba(255,255,255,0.9)", mb: 4 }}
            >
              Join families worldwide who are preserving their precious memories
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/signup")}
              sx={{
                // 👈 Changed: Use secondary color for a vibrant CTA button
                backgroundColor: "secondary.main",
                color: "white",
                px: 6,
                py: 2,
                fontSize: "1.2rem",
                "&:hover": {
                  backgroundColor: "secondary.dark",
                },
              }}
            >
              Get Started Free
            </Button>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default Landing;