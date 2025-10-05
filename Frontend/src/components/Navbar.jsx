import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { auth } from "../Firebase/fireBase";
import { signOut } from "firebase/auth";
import {
  AutoStories,
  AdminPanelSettings,
  Dashboard,
  Timeline,
  Search,
  Person,
  Logout,
  Notifications,
} from "@mui/icons-material";
import {
  getPendingRelationshipsForAdmin,
  getFamilyCircle,
} from "../api/services";

const Navbar = () => {
  const navigate = useNavigate();
  const firebaseUser = useSelector((state) => state.auth.firebaseUser);
  const mongoUser = useSelector((state) => state.auth.mongoUser);

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [familyCircle, setFamilyCircle] = useState(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (mongoUser?.familyCircle) {
        try {
          // Extract ID if familyCircle is an object, otherwise use as-is
          const circleId =
            typeof mongoUser.familyCircle === "object"
              ? mongoUser.familyCircle._id
              : mongoUser.familyCircle;

          if (!circleId) {
            console.error("No valid circle ID found");
            setIsAdmin(false);
            setFamilyCircle(null);
            setPendingCount(0);
            return;
          }

          const circle = await getFamilyCircle(circleId);
          const userIsAdmin = circle.admin._id === mongoUser._id;
          setIsAdmin(userIsAdmin);
          setFamilyCircle(circle);

          if (userIsAdmin) {
            const approvals = await getPendingRelationshipsForAdmin();
            setPendingCount(approvals.length);
          }
        } catch (err) {
          console.error("Error checking admin status:", err);
          // Reset states on error
          setIsAdmin(false);
          setFamilyCircle(null);
          setPendingCount(0);
        }
      } else {
        setIsAdmin(false);
        setFamilyCircle(null);
        setPendingCount(0);
      }
    };

    if (mongoUser) {
      checkAdminStatus();
      const interval = setInterval(checkAdminStatus, 30000);
      return () => clearInterval(interval);
    } else {
      setIsAdmin(false);
      setFamilyCircle(null);
      setPendingCount(0);
      setAnchorEl(null);
      setNotifAnchorEl(null);
    }
  }, [mongoUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotifMenuOpen = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotifMenuClose = () => {
    setNotifAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleProfileMenuClose();
    handleNotifMenuClose();
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

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {firebaseUser ? (
              <>
                <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                  <Button
                    color="inherit"
                    startIcon={<Dashboard />}
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={<Timeline />}
                    onClick={() => navigate("/timeline")}
                  >
                    Timeline
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={<Search />}
                    onClick={() => navigate("/search")}
                  >
                    Search
                  </Button>

                  {isAdmin && familyCircle && (
                    <Badge badgeContent={pendingCount} color="error">
                      <Button
                        color="warning"
                        variant="outlined"
                        startIcon={<AdminPanelSettings />}
                        onClick={() => {
                          const circleId =
                            typeof familyCircle === "object"
                              ? familyCircle._id
                              : familyCircle;
                          navigate(`/admin-dashboard/${circleId}`);
                        }}
                        sx={{ fontWeight: 600 }}
                      >
                        Admin
                      </Button>
                    </Badge>
                  )}
                </Box>

                {isAdmin && familyCircle && (
                  <IconButton
                    color="inherit"
                    onClick={handleNotifMenuOpen}
                    sx={{ display: { md: "none" } }}
                  >
                    <Badge badgeContent={pendingCount} color="error">
                      <Notifications />
                    </Badge>
                  </IconButton>
                )}

                <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 1 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "primary.main",
                      fontSize: "1rem",
                    }}
                  >
                    {mongoUser?.name?.charAt(0) || "U"}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 200,
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {mongoUser?.name || "User"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {mongoUser?.email}
                    </Typography>
                  </Box>
                  <Divider />

                  <Box sx={{ display: { md: "none" } }}>
                    <MenuItem onClick={() => handleNavigate("/dashboard")}>
                      <ListItemIcon>
                        <Dashboard fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Dashboard</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigate("/timeline")}>
                      <ListItemIcon>
                        <Timeline fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Timeline</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigate("/search")}>
                      <ListItemIcon>
                        <Search fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Search</ListItemText>
                    </MenuItem>
                    <Divider />
                  </Box>

                  <MenuItem onClick={() => handleNavigate("/profile")}>
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                  </MenuItem>

                  {isAdmin && familyCircle && (
                    <MenuItem
                      onClick={() => {
                        const circleId =
                          typeof familyCircle === "object"
                            ? familyCircle._id
                            : familyCircle;
                        handleNavigate(`/admin-dashboard/${circleId}`);
                      }}
                    >
                      <ListItemIcon>
                        <Badge badgeContent={pendingCount} color="error">
                          <AdminPanelSettings fontSize="small" />
                        </Badge>
                      </ListItemIcon>
                      <ListItemText>Admin Dashboard</ListItemText>
                    </MenuItem>
                  )}

                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>

                <Menu
                  anchorEl={notifAnchorEl}
                  open={Boolean(notifAnchorEl)}
                  onClose={handleNotifMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 280,
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Admin Notifications
                    </Typography>
                  </Box>
                  <Divider />
                  {pendingCount > 0 ? (
                    <MenuItem
                      onClick={() => {
                        const circleId =
                          typeof familyCircle === "object"
                            ? familyCircle._id
                            : familyCircle;
                        handleNavigate(`/admin-dashboard/${circleId}`);
                      }}
                    >
                      <ListItemIcon>
                        <Badge badgeContent={pendingCount} color="error">
                          <AdminPanelSettings
                            fontSize="small"
                            color="warning"
                          />
                        </Badge>
                      </ListItemIcon>
                      <ListItemText
                        primary={`${pendingCount} Pending Approval${
                          pendingCount > 1 ? "s" : ""
                        }`}
                        secondary="Click to review"
                      />
                    </MenuItem>
                  ) : (
                    <Box sx={{ px: 2, py: 2, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        No pending approvals
                      </Typography>
                    </Box>
                  )}
                </Menu>
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
