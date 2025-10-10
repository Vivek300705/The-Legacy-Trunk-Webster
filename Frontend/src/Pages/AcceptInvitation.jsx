import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
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
import { acceptInvitation } from "../api/services";

const AcceptInvitation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const mongoUser = useSelector((state) => state.auth.mongoUser);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [familyCircle, setFamilyCircle] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    if (!mongoUser) {
      console.log(
        "User not logged in, storing token and redirecting to signup"
      );
      localStorage.setItem("pendingInvitation", token);
      setError(
        "You need to create an account first to accept this invitation."
      );
      setLoading(false);

      setTimeout(() => {
        navigate("/signup");
      }, 3000);
      return;
    }

    // User is logged in, try to accept invitation
    handleAcceptInvitation();
  }, [mongoUser, token, navigate]);

  const handleAcceptInvitation = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("Attempting to accept invitation with token:", token);
      const response = await acceptInvitation(token);
      console.log("Invitation accepted successfully:", response);

      setSuccess(true);
      setFamilyCircle(response.family);

      setTimeout(() => {
        navigate(`/family-circle/${response.family._id}`);
      }, 2000);
    } catch (err) {
      console.error("Error accepting invitation:", err);

      // Check if it's a 404 (user doesn't exist in invitation)
      if (err.response?.status === 404) {
        localStorage.setItem("pendingInvitation", token);
        setError(
          "You need to create an account with the invited email address. Redirecting to signup..."
        );

        setTimeout(() => {
          navigate("/signup");
        }, 3000);
      }
      // Check if it's a 403 (wrong email)
      else if (err.response?.status === 403) {
        setError(
          err.response?.data?.message ||
            "This invitation is for a different email address. Please log in with the correct account."
        );
      }
      // Other errors
      else {
        setError(err.response?.data?.message || "Failed to accept invitation");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FAFAFA",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            border: "1px solid #E0E0E0",
          }}
        >
          {loading && (
            <Box>
              <CircularProgress size={64} sx={{ mb: 3 }} />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Processing Invitation...
              </Typography>
              <Typography color="text.secondary">
                Please wait while we process your invitation.
              </Typography>
            </Box>
          )}

          {!loading && success && (
            <Box>
              <CheckCircle
                sx={{ fontSize: 80, color: "success.main", mb: 3 }}
              />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Welcome to the Family!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                You've successfully joined {familyCircle?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Redirecting to your family circle...
              </Typography>
            </Box>
          )}

          {!loading && error && (
            <Box>
              <Error sx={{ fontSize: 80, color: "error.main", mb: 3 }} />
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
              {!error.includes("Redirecting") && (
                <Button
                  variant="outlined"
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                </Button>
              )}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AcceptInvitation;
