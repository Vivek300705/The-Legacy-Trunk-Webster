import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import {
  FamilyRestroom,
  Add,
  Delete,
  Email,
  PersonAdd,
  Edit,
  Save,
  Cancel,
  AdminPanelSettings,
  Send,
  Close,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getFamilyCircle,
  inviteMember,
  getCircleInvitations,
  removeMember,
  updateCircleName,
  cancelInvitation,
} from "../api/services";

const FamilyCircleDetailsPage = () => {
  const { circleId } = useParams();
  const navigate = useNavigate();
  const mongoUser = useSelector((state) => state.auth.mongoUser);

  const [familyCircle, setFamilyCircle] = useState(null);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  // Add Member Dialog State
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);

  // Edit Circle Name State
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editNameLoading, setEditNameLoading] = useState(false);

  // Cancel invitation loading state
  const [cancellingInviteId, setCancellingInviteId] = useState(null);

  // Check if current user is admin
  const isAdmin = familyCircle?.admin?._id === mongoUser?._id;

  // Fetch family circle data
  useEffect(() => {
    const fetchData = async () => {
      if (!circleId) {
        setError("No circle ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const circle = await getFamilyCircle(circleId);
        setFamilyCircle(circle);
        setEditedName(circle.name);

        const invites = await getCircleInvitations(circleId);
        setPendingInvitations(invites);
      } catch (err) {
        console.error("Error fetching circle:", err);
        setError(err.response?.data?.message || "Failed to load family circle");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [circleId]);

  // Validate email
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handle invite member
  const handleInviteMember = async () => {
    const trimmedEmail = inviteEmail.trim().toLowerCase();

    if (!trimmedEmail) {
      setError("Please enter an email address");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (trimmedEmail === mongoUser?.email?.toLowerCase()) {
      setError("You cannot invite yourself");
      return;
    }

    // Check if already a member
    const isMember = familyCircle?.member?.some(
      (m) => m.email?.toLowerCase() === trimmedEmail
    );
    if (isMember) {
      setError("This person is already a member");
      return;
    }

    // Check if already invited
    const isInvited = pendingInvitations.some(
      (inv) => inv.email?.toLowerCase() === trimmedEmail
    );
    if (isInvited) {
      setError("This person has already been invited");
      return;
    }

    setInviteLoading(true);
    setError("");

    try {
      await inviteMember(circleId, trimmedEmail);
      setSuccess(`Invitation sent to ${trimmedEmail}`);
      setInviteEmail("");
      setInviteDialogOpen(false);

      // Refresh invitations
      const invites = await getCircleInvitations(circleId);
      setPendingInvitations(invites);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send invitation");
    } finally {
      setInviteLoading(false);
    }
  };

  // Handle cancel invitation
  const handleCancelInvitation = async (invitationId) => {
    if (!window.confirm("Are you sure you want to cancel this invitation?")) {
      return;
    }

    setCancellingInviteId(invitationId);
    setError("");

    try {
      await cancelInvitation(invitationId);
      setSuccess("Invitation cancelled successfully");

      // Remove from local state
      setPendingInvitations((prev) =>
        prev.filter((inv) => inv._id !== invitationId)
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel invitation");
    } finally {
      setCancellingInviteId(null);
    }
  };

  // Handle remove member (admin only)
  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) {
      return;
    }

    try {
      await removeMember(circleId, memberId);
      setSuccess("Member removed successfully");

      // Refresh circle data
      const circle = await getFamilyCircle(circleId);
      setFamilyCircle(circle);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove member");
    }
  };

  // Handle update circle name (admin only)
  const handleUpdateName = async () => {
    if (!editedName.trim()) {
      setError("Circle name cannot be empty");
      return;
    }

    if (editedName.trim() === familyCircle.name) {
      setIsEditingName(false);
      return;
    }

    setEditNameLoading(true);
    setError("");

    try {
      await updateCircleName(circleId, editedName.trim());
      setSuccess("Circle name updated successfully");
      setFamilyCircle({ ...familyCircle, name: editedName.trim() });
      setIsEditingName(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update circle name");
    } finally {
      setEditNameLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(familyCircle.name);
    setIsEditingName(false);
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ py: 6, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!familyCircle) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="error">Family circle not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            <FamilyRestroom
              sx={{ fontSize: 48, color: "primary.main", mr: 2 }}
            />
            {isEditingName ? (
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}
              >
                <TextField
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  size="small"
                  fullWidth
                  autoFocus
                />
                <IconButton
                  color="primary"
                  onClick={handleUpdateName}
                  disabled={editNameLoading}
                >
                  <Save />
                </IconButton>
                <IconButton color="error" onClick={handleCancelEdit}>
                  <Cancel />
                </IconButton>
              </Box>
            ) : (
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {familyCircle.name}
                  </Typography>
                  {isAdmin && (
                    <IconButton
                      size="small"
                      onClick={() => setIsEditingName(true)}
                      color="primary"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                {isAdmin && (
                  <Chip
                    icon={<AdminPanelSettings />}
                    label="Admin"
                    color="primary"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>
            )}
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => setInviteDialogOpen(true)}
            size="large"
          >
            Invite Member
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Created {new Date(familyCircle.createdAt).toLocaleDateString()}
        </Typography>
      </Paper>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label={`Members (${familyCircle.member?.length || 0})`} />
          <Tab label={`Pending Invitations (${pendingInvitations.length})`} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {familyCircle.member?.map((member) => (
            <Grid item xs={12} sm={6} md={4} key={member._id}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        width: 56,
                        height: 56,
                        mr: 2,
                      }}
                    >
                      {member.name?.charAt(0)?.toUpperCase() || "?"}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {member.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {member.email}
                      </Typography>
                    </Box>
                  </Box>

                  {member._id === familyCircle.admin._id && (
                    <Chip
                      icon={<AdminPanelSettings />}
                      label="Admin"
                      color="primary"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  )}

                  {isAdmin && member._id !== familyCircle.admin._id && (
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Delete />}
                      onClick={() => handleRemoveMember(member._id)}
                      sx={{ mt: 1 }}
                    >
                      Remove
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          {pendingInvitations.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: "center" }}>
                <Email sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No pending invitations
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Invite family members to join your circle
                </Typography>
              </Paper>
            </Grid>
          ) : (
            pendingInvitations.map((invite) => (
              <Grid item xs={12} sm={6} md={4} key={invite._id}>
                <Card elevation={2}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", flex: 1 }}
                      >
                        <Avatar sx={{ bgcolor: "info.main", mr: 2 }}>
                          <Email />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {invite.email}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Invited by {invite.invitedBy?.name}
                          </Typography>
                        </Box>
                      </Box>
                      {isAdmin && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleCancelInvitation(invite._id)}
                          disabled={cancellingInviteId === invite._id}
                        >
                          {cancellingInviteId === invite._id ? (
                            <CircularProgress size={20} />
                          ) : (
                            <Close />
                          )}
                        </IconButton>
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Sent {new Date(invite.createdAt).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label="Pending"
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Invite Member Dialog */}
      <Dialog
        open={inviteDialogOpen}
        onClose={() => {
          setInviteDialogOpen(false);
          setInviteEmail("");
          setError("");
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Invite Family Member</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter the email address of the person you'd like to invite to your
            family circle.
          </Typography>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleInviteMember();
              }
            }}
            placeholder="example@email.com"
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setInviteDialogOpen(false);
              setInviteEmail("");
              setError("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={handleInviteMember}
            disabled={inviteLoading || !inviteEmail.trim()}
          >
            {inviteLoading ? "Sending..." : "Send Invitation"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FamilyCircleDetailsPage;
