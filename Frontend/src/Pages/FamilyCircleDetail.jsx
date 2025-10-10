import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Snackbar,
  Grid,
  Card,
  CardContent,
  Divider,
  Badge,
} from "@mui/material";
import {
  Edit,
  Delete,
  PersonAdd,
  ExitToApp,
  AccountTree,
  ArrowBack,
  AdminPanelSettings,
  Close,
  Visibility,
  PendingActions,
  Email,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import {
  getFamilyCircle,
  inviteMember,
  removeMember,
  leaveFamilyCircle,
  deleteFamilyCircle,
  updateCircleName,
  getCircleInvitations,
  cancelInvitation,
  getPendingRelationshipsForAdmin,
} from "../api/services";

const FamilyCircleDetail = () => {
  const { circleId } = useParams();
  const navigate = useNavigate();
  const mongoUser = useSelector((state) => state.auth.mongoUser);

  const [familyData, setFamilyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Dialog states
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form states
  const [inviteEmail, setInviteEmail] = useState("");
  const [newCircleName, setNewCircleName] = useState("");
  const [invitations, setInvitations] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    fetchFamilyData();
    fetchInvitations();
    fetchPendingApprovals();
  }, [circleId]);

  const fetchFamilyData = async () => {
    try {
      setLoading(true);
      const data = await getFamilyCircle(circleId);
      setFamilyData(data);
      setNewCircleName(data.name);

      // Check if current user is admin
      const userIsAdmin = data.admin._id === mongoUser?._id;
      setIsAdmin(userIsAdmin);
    } catch (err) {
      console.error("Error fetching family data:", err);
      setError(err.response?.data?.message || "Failed to load family circle");
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitations = async () => {
    try {
      const data = await getCircleInvitations(circleId);
      setInvitations(data);
    } catch (err) {
      console.error("Error fetching invitations:", err);
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      if (mongoUser) {
        const approvals = await getPendingRelationshipsForAdmin();
        setPendingApprovals(approvals);
      }
    } catch (err) {
      console.error("Error fetching pending approvals:", err);
    }
  };

  const handleInviteMember = async () => {
    try {
      if (!inviteEmail.trim()) {
        setSnackbar({
          open: true,
          message: "Please enter an email address",
          severity: "warning",
        });
        return;
      }

      await inviteMember(circleId, inviteEmail);
      setSnackbar({
        open: true,
        message: "Invitation sent successfully!",
        severity: "success",
      });
      setInviteEmail("");
      setInviteDialogOpen(false);
      fetchInvitations();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to send invitation",
        severity: "error",
      });
    }
  };

  const handleCancelInvitation = async (invitationId) => {
    try {
      await cancelInvitation(invitationId);
      setSnackbar({
        open: true,
        message: "Invitation cancelled",
        severity: "success",
      });
      fetchInvitations();
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to cancel invitation",
        severity: "error",
      });
    }
  };

  const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName}?`)) {
      return;
    }

    try {
      await removeMember(circleId, memberId);
      setSnackbar({
        open: true,
        message: "Member removed successfully",
        severity: "success",
      });
      fetchFamilyData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to remove member",
        severity: "error",
      });
    }
  };

  const handleUpdateCircleName = async () => {
    try {
      if (!newCircleName.trim()) {
        setSnackbar({
          open: true,
          message: "Circle name cannot be empty",
          severity: "warning",
        });
        return;
      }

      await updateCircleName(circleId, newCircleName);
      setSnackbar({
        open: true,
        message: "Circle name updated successfully",
        severity: "success",
      });
      setEditDialogOpen(false);
      fetchFamilyData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to update circle name",
        severity: "error",
      });
    }
  };

  const handleLeaveCircle = async () => {
    if (!window.confirm("Are you sure you want to leave this family circle?")) {
      return;
    }

    try {
      await leaveFamilyCircle(circleId);
      setSnackbar({
        open: true,
        message: "You have left the family circle",
        severity: "success",
      });
      navigate("/dashboard");
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to leave circle",
        severity: "error",
      });
    }
  };

  const handleDeleteCircle = async () => {
    try {
      await deleteFamilyCircle(circleId);
      setSnackbar({
        open: true,
        message: "Family circle deleted successfully",
        severity: "success",
      });
      navigate("/dashboard");
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to delete circle",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/dashboard")}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/dashboard")}
            sx={{ mb: 2 }}
          >
            Back to Dashboard
          </Button>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                {familyData?.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  label={`${familyData?.member?.length || 0} Members`}
                  size="small"
                  color="primary"
                />
                {isAdmin && (
                  <Chip
                    icon={<AdminPanelSettings />}
                    label="Admin"
                    size="small"
                    color="warning"
                  />
                )}
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                startIcon={<AccountTree />}
                onClick={() => navigate(`/family-tree/${circleId}`)}
              >
                Build Family Tree
              </Button>

              <Button
                variant="contained"
                color="secondary"
                startIcon={<Visibility />}
                onClick={() => navigate(`/family-tree-view/${circleId}`)}
              >
                View Tree
              </Button>

              {isAdmin && (
                <Badge badgeContent={pendingApprovals.length} color="error">
                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={<AdminPanelSettings />}
                    onClick={() => navigate(`/admin-dashboard/${circleId}`)}
                  >
                    Admin Dashboard
                  </Button>
                </Badge>
              )}

              {isAdmin && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => setEditDialogOpen(true)}
                  >
                    Edit Circle
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete
                  </Button>
                </>
              )}

              {!isAdmin && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<ExitToApp />}
                  onClick={handleLeaveCircle}
                >
                  Leave Circle
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {/* Admin Alert for Pending Approvals */}
        {isAdmin && pendingApprovals.length > 0 && (
          <Alert
            severity="warning"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => navigate(`/admin-dashboard/${circleId}`)}
              >
                View All
              </Button>
            }
            sx={{ mb: 3 }}
          >
            You have <strong>{pendingApprovals.length}</strong> relationship
            {pendingApprovals.length > 1 ? "s" : ""} awaiting admin approval
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Admin Info Card */}
<<<<<<< HEAD
          <Grid item xs={12} md={4} width={"450px"}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600}  gutterBottom>
=======
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
                Circle Admin
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={familyData?.admin?.profilePicture}
                  sx={{ width: 60, height: 60, bgcolor: "primary.main" }}
                >
                  {familyData?.admin?.name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {familyData?.admin?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {familyData?.admin?.email}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Quick Stats */}
            {isAdmin && (
              <Paper sx={{ p: 3, borderRadius: 2, mt: 2 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Quick Stats
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card
                      sx={{ textAlign: "center", bgcolor: "primary.lighter" }}
                    >
                      <CardContent>
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          color="primary.main"
                        >
                          {familyData?.member?.length || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Members
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card
                      sx={{ textAlign: "center", bgcolor: "warning.lighter" }}
                    >
                      <CardContent>
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          color="warning.main"
                        >
                          {pendingApprovals.length}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Pending
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card sx={{ textAlign: "center", bgcolor: "info.lighter" }}>
                      <CardContent>
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          color="info.main"
                        >
                          {invitations.length}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Invites
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card
                      sx={{
                        textAlign: "center",
                        bgcolor: "success.lighter",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: 2,
                        },
                      }}
                      onClick={() => navigate(`/family-tree-view/${circleId}`)}
                    >
                      <CardContent>
                        <AccountTree color="success" />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          View Tree
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Grid>

          {/* Members List */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
<<<<<<< HEAD
                <Typography variant="h6" fontWeight={600} width={"300px"}>
=======
                <Typography variant="h6" fontWeight={600}>
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
                  Family Members ({familyData?.member?.length || 0})
                </Typography>
                {isAdmin && (
                  <Button
                    variant="contained"
                    startIcon={<PersonAdd />}
                    onClick={() => setInviteDialogOpen(true)}
                  >
                    Invite Member
                  </Button>
                )}
              </Box>

              <Divider sx={{ mb: 2 }} />

              <List>
                {familyData?.member?.map((member) => (
                  <ListItem
                    key={member._id}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      border: "1px solid",
                      borderColor: "divider",
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={member.profilePicture}
                        sx={{ bgcolor: "primary.main" }}
                      >
                        {member.name?.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography variant="subtitle1" fontWeight={600}>
                            {member.name}
                          </Typography>
                          {member._id === familyData?.admin?._id && (
                            <Chip
                              label="Admin"
                              size="small"
                              color="warning"
                              sx={{ height: 20 }}
                            />
                          )}
                          {member._id === mongoUser?._id && (
                            <Chip
                              label="You"
                              size="small"
                              color="primary"
                              sx={{ height: 20 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={member.email}
                    />
                    {isAdmin && member._id !== familyData?.admin?._id && (
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() =>
                            handleRemoveMember(member._id, member.name)
                          }
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* Pending Invitations */}
            {isAdmin && invitations.length > 0 && (
              <Paper sx={{ p: 3, borderRadius: 2, mt: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Email color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Pending Invitations ({invitations.length})
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <List>
                  {invitations.map((invitation) => (
                    <ListItem
                      key={invitation._id}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        border: "1px solid",
                        borderColor: "warning.main",
                        bgcolor: "warning.lighter",
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "warning.main" }}>
                          <Email />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={invitation.email}
                        secondary={`Invited by ${
                          invitation.invitedBy?.name
                        } • Expires ${new Date(
                          invitation.expiresAt
                        ).toLocaleDateString()}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => handleCancelInvitation(invitation._id)}
                        >
                          <CancelIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Grid>
        </Grid>

        {/* Invite Member Dialog */}
        <Dialog
          open={inviteDialogOpen}
          onClose={() => setInviteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Invite Family Member</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleInviteMember}
              variant="contained"
              startIcon={<PersonAdd />}
            >
              Send Invitation
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Circle Name Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Circle Name</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Circle Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newCircleName}
              onChange={(e) => setNewCircleName(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleUpdateCircleName}
              variant="contained"
              startIcon={<Edit />}
            >
              Update Name
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Circle Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="sm"
        >
          <DialogTitle>Delete Family Circle</DialogTitle>
          <DialogContent>
            <Alert severity="error" sx={{ mb: 2 }}>
              This action cannot be undone!
            </Alert>
            <Typography>
              Are you sure you want to delete{" "}
              <strong>{familyData?.name}</strong>? All members will be removed
              from the circle.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDeleteCircle}
              variant="contained"
              color="error"
              startIcon={<Delete />}
            >
              Delete Circle
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
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
    </Box>
  );
};

export default FamilyCircleDetail;
