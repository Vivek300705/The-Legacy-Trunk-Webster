import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";
import axios from "axios";

const AcceptInvitation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [familyCircle, setFamilyCircle] = useState(null);

  const handleAcceptInvitation = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `/api/family-circle/accept-invitation/${token}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccess(true);
      setFamilyCircle(response.data.family);

      setTimeout(() => {
        navigate(`/family-circle/${response.data.family._id}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to accept invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        {!success && !error && (
          <>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
              Family Circle Invitation
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              You've been invited to join a family circle on StoryNest!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleAcceptInvitation}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Accept Invitation"}
            </Button>
          </>
        )}

        {success && (
          <Box>
            <CheckCircle sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Welcome to the Family!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You've successfully joined {familyCircle?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Redirecting to your family circle...
            </Typography>
          </Box>
        )}

        {error && (
          <Box>
            <Error sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button variant="outlined" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AcceptInvitation;
