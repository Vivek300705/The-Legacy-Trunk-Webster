import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  TextField,
  Grid,
  IconButton,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import {
  AccountTree,
  PersonAdd,
  Email,
  Delete,
  AdminPanelSettings,
  Person,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getFamilyCircle, inviteMember, removeMember } from "../api/services";

const FamilyCircle = () => {
  const navigate = useNavigate();
  const { circleId } = useParams();
  const currentUser = useSelector((state) => state.auth.user);

  const [inviteEmail, setInviteEmail] = useState("");
  const [familyCircle, setFamilyCircle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const isAdmin = familyCircle?.admin?._id === currentUser?._id;

  useEffect(() => {
    const fetchFamilyCircle = async () => {
      try {
        setLoading(true);
        const data = await getFamilyCircle(circleId);
        setFamilyCircle(data);
      } catch (err) {
        console.error("Error fetching family circle:", err);
        setError(err.response?.data?.message || "Failed to load family circle");
      } finally {
        setLoading(false);
      }
    };

    if (circleId) {
      fetchFamilyCircle();
    }
  }, [circleId]);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;

    try {
      await inviteMember(circleId, inviteEmail);
      setSnackbar({
        open: true,
        message: "Invitation sent successfully!",
        severity: "success",
      });
      setInviteEmail("");
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to send invitation",
        severity: "error",
      });
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) {
      return;
    }

    try {
      await removeMember(circleId, memberId);
      setFamilyCircle({
        ...familyCircle,
        members: familyCircle.members.filter((m) => m._id !== memberId),
      });
      setSnackbar({
        open: true,
        message: "Member removed successfully",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to remove member",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!familyCircle) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning">Family circle not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          {familyCircle.name}
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AccountTree />}
            onClick={() => navigate(`/family-tree/${circleId}`)}
            size="large"
          >
            Build Family Tree
          </Button>
        )}
      </Box>

      {/* Invite New Member */}
      {isAdmin && (
        <Card sx={{ mb: 4, bgcolor: "background.paper" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <PersonAdd sx={{ fontSize: 28, color: "primary.main", mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Invite New Member
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                fullWidth
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                variant="outlined"
                type="email"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleInvite();
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <Email sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
              <Button
                variant="contained"
                onClick={handleInvite}
                disabled={!inviteEmail.trim()}
                sx={{ minWidth: 120 }}
              >
                Send Invite
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Members List */}
      <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Members ({familyCircle.members?.length || 0})
        </Typography>
        {familyCircle.members && familyCircle.members.length > 0 ? (
          <Grid container spacing={3}>
            {familyCircle.members.map((member) => {
              const memberIsAdmin = member._id === familyCircle.admin?._id;
              return (
                <Grid item xs={12} sm={6} md={4} key={member._id}>
                  <Card
                    sx={{
                      height: "100%",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        <Avatar
                          src={member.profilePicture}
                          sx={{
                            width: 80,
                            height: 80,
                            mb: 2,
                            bgcolor: "primary.main",
                            fontSize: "2rem",
                          }}
                        >
                          {member.name?.charAt(0) || "U"}
                        </Avatar>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          {member.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {member.email}
                        </Typography>
                        <Chip
                          icon={
                            memberIsAdmin ? <AdminPanelSettings /> : <Person />
                          }
                          label={
                            memberIsAdmin ? "Admin" : member.role || "Member"
                          }
                          color={memberIsAdmin ? "primary" : "default"}
                          size="small"
                          sx={{ mb: 2 }}
                        />
                        {isAdmin &&
                          !memberIsAdmin &&
                          member._id !== currentUser._id && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveMember(member._id)}
                              sx={{ mt: 1 }}
                            >
                              <Delete />
                            </IconButton>
                          )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Alert severity="info">
            No members yet. Invite people to join your family circle!
          </Alert>
        )}
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FamilyCircle;
