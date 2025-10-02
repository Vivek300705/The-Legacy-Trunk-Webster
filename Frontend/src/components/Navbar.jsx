import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { auth } from "../Firebase/fireBase";
import { signOut } from "firebase/auth";
import { AutoStories } from "@mui/icons-material";

const Navbar = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <AutoStories sx={{ color: "primary.main", fontSize: 32 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              StoryNest
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {user ? (
              <>
                <Button color="inherit" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
                <Button color="inherit" onClick={() => navigate("/timeline")}>
                  Timeline
                </Button>
                <Button color="inherit" onClick={() => navigate("/search")}>
                  Search
                </Button>
                <Button color="inherit" onClick={() => navigate("/profile")}>
                  Profile
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
