import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  Snackbar,
} from "@mui/material";
import {
  AdminPanelSettings,
  CheckCircle,
  Cancel,
  ArrowBack,
  PendingActions,
} from "@mui/icons-material";
import {
  getPendingRelationshipsForAdmin,
  adminApproveRelationship,
  getFamilyCircle,
} from "../api/services";

const AdminDashboard = () => {
  const { circleId } = useParams();
  const navigate = useNavigate();
  const mongoUser = useSelector((state) => state.auth.mongoUser);

  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [familyCircle, setFamilyCircle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    fetchData();
  }, [circleId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch family circle
      const circle = await getFamilyCircle(circleId);
      setFamilyCircle(circle);

      // Check if user is admin
      const userIsAdmin = circle.admin._id === mongoUser?._id;
      setIsAdmin(userIsAdmin);

      if (userIsAdmin) {
        // Fetch pending approvals
        const approvals = await getPendingRelationshipsForAdmin();
        setPendingApprovals(approvals);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to load data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (relationshipId, approve) => {
    try {
      await adminApproveRelationship(relationshipId, approve);

      setSnackbar({
        open: true,
        message: `Relationship ${
          approve ? "approved" : "rejected"
        } successfully!`,
        severity: "success",
      });

      // Remove from pending list
      setPendingApprovals((prev) =>
        prev.filter((r) => r._id !== relationshipId)
      );
    } catch (err) {
      console.error("Admin approval error:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to process request",
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

  if (!isAdmin) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          You don't have admin permissions for this family circle.
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate(`/family-circle/${circleId}`)}
          sx={{ mt: 2 }}
        >
          Back to Family Circle
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(`/family-circle/${circleId}`)}
            >
              Back
            </Button>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AdminPanelSettings sx={{ fontSize: 40, color: "primary.main" }} />
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Admin Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {familyCircle?.name}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Pending Approvals Section */}
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <PendingActions sx={{ fontSize: 32, color: "warning.main" }} />
              <Typography variant="h6" fontWeight={600}>
                Pending Relationship Approvals
              </Typography>
            </Box>
            <Chip
              label={`${pendingApprovals.length} pending`}
              color={pendingApprovals.length > 0 ? "warning" : "success"}
              size="small"
            />
          </Box>

          <Divider sx={{ mb: 3 }} />

          {pendingApprovals.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 6,
                color: "text.secondary",
              }}
            >
              <CheckCircle sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" gutterBottom>
                All Caught Up!
              </Typography>
              <Typography variant="body2">
                No pending relationship approvals at this time.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {pendingApprovals.map((relationship) => (
                <Card
                  key={relationship._id}
                  sx={{
                    border: 1,
                    borderColor: "warning.main",
                    bgcolor: "warning.lighter",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2,
                      }}
                    >
                      {/* Requester */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          src={relationship.requester?.profilePicture}
                          alt={relationship.requester?.name}
                          sx={{ width: 56, height: 56 }}
                        />
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {relationship.requester?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {relationship.requester?.email}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Relationship Type */}
                      <Box sx={{ textAlign: "center" }}>
                        <Chip
                          label={relationship.relationshipType}
                          color="primary"
                          size="small"
                          sx={{ mb: 0.5 }}
                        />
                        <Typography variant="caption" display="block">
                          relationship with
                        </Typography>
                      </Box>

                      {/* Recipient */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box sx={{ textAlign: "right" }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {relationship.recipient?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {relationship.recipient?.email}
                          </Typography>
                        </Box>
                        <Avatar
                          src={relationship.recipient?.profilePicture}
                          alt={relationship.recipient?.name}
                          sx={{ width: 56, height: 56 }}
                        />
                      </Box>
                    </Box>

                    {/* Info Message */}
                    <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
                      Both users have approved this relationship. Your admin
                      approval is required to finalize it.
                    </Alert>

                    {/* Action Buttons */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={() => handleApprove(relationship._id, false)}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={() => handleApprove(relationship._id, true)}
                      >
                        Approve
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Paper>

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

export default AdminDashboard;
