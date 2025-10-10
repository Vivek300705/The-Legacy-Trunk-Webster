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
  ListItemSecondaryAction,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  FamilyRestroom,
  Add,
  Delete,
  PersonAdd,
  ArrowForward,
  Email,
  CheckCircle,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  createFamilyCircle,
  inviteMember,
  getFamilyCircle,
  getCircleInvitations,
} from "../api/services";

const FamilyCircleWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Name, 2 = Invite, 3 = Circle Overview
  const [name, setName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [inviteList, setInviteList] = useState([]);
  const [familyCircle, setFamilyCircle] = useState(null);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [invitationResults, setInvitationResults] = useState([]);

  // Validate email
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Add email to list
  const handleAddEmail = () => {
    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed) return setError("Please enter an email address");
    if (!isValidEmail(trimmed)) return setError("Invalid email address");
    if (inviteList.includes(trimmed)) return setError("Already in the list");

    setInviteList([...inviteList, trimmed]);
    setEmailInput("");
    setError("");
  };

  // Remove email
  const handleRemoveEmail = (email) => {
    setInviteList(inviteList.filter((e) => e !== email));
  };

  // Step 1: Create Circle
  const handleCreateCircle = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Please enter a family circle name");

    setLoading(true);
    setError("");
    try {
      const newCircle = await createFamilyCircle(name.trim());
      setFamilyCircle(newCircle);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create circle");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Send Invitations
  const handleSendInvitations = async () => {
    if (!familyCircle) return;

    // If no invites to send, skip to overview
    if (inviteList.length === 0) {
      setStep(3);
      return;
    }

    setLoading(true);
    setError("");
    const results = [];

    try {
      // Send invitations one by one and track results
      for (const email of inviteList) {
        try {
          await inviteMember(familyCircle._id, email);
          results.push({ email, success: true });
        } catch (err) {
          results.push({
            email,
            success: false,
            error: err.response?.data?.message || "Failed to send",
          });
        }
      }

      setInvitationResults(results);

      // Fetch updated invites and circle info
      try {
        const invites = await getCircleInvitations(familyCircle._id);
        setPendingInvitations(invites);
      } catch (err) {
        console.error("Error fetching invitations:", err);
      }

      try {
        const updated = await getFamilyCircle(familyCircle._id);
        setFamilyCircle(updated);
      } catch (err) {
        console.error("Error fetching circle:", err);
      }

      // Check if all were successful
      const allSuccess = results.every((r) => r.success);
      if (!allSuccess) {
        const failedCount = results.filter((r) => !r.success).length;
        setError(
          `${failedCount} invitation${
            failedCount > 1 ? "s" : ""
          } failed to send. See details below.`
        );
      }

      setStep(3);
    } catch (err) {
      setError("Error sending invitations");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Overview - Fetch invites on mount
  useEffect(() => {
    const fetchInvites = async () => {
      if (familyCircle?._id) {
        try {
          const invites = await getCircleInvitations(familyCircle._id);
          setPendingInvitations(invites);
        } catch (err) {
          console.error("Error fetching invitations:", err);
        }
      }
    };
    fetchInvites();
  }, [familyCircle?._id]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <FamilyRestroom sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            {step === 1 && "Create Your Family Circle"}
            {step === 2 && "Invite Family Members"}
            {step === 3 && "Family Circle Overview"}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <form onSubmit={handleCreateCircle}>
            <TextField
              fullWidth
              label="Family Circle Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
              placeholder="e.g., Smith Family, Johnson Clan"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3 }}
              endIcon={
                loading ? <CircularProgress size={20} /> : <ArrowForward />
              }
            >
              {loading ? "Creating..." : "Continue"}
            </Button>
          </form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Box>
            <TextField
              fullWidth
              label="Email Address"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddEmail();
                }
              }}
              placeholder="Enter email address and press Enter"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={handleAddEmail}
                    disabled={!emailInput.trim()}
                    color="primary"
                  >
                    <Add />
                  </IconButton>
                ),
              }}
            />
            {inviteList.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Emails to invite ({inviteList.length}):
                </Typography>
                <List>
                  {inviteList.map((email, i) => (
                    <ListItem
                      key={i}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        mb: 1,
                      }}
                    >
                      <ListItemText primary={email} />
                      <ListItemSecondaryAction>
                        <IconButton
                          onClick={() => handleRemoveEmail(email)}
                          color="error"
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </>
            )}
            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                disabled={loading}
                onClick={() => {
                  setStep(3);
                }}
              >
                Skip for Now
              </Button>
              <Button
                variant="contained"
                fullWidth
                disabled={loading || inviteList.length === 0}
                onClick={handleSendInvitations}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <PersonAdd />
                }
              >
                {loading
                  ? "Sending..."
                  : `Send ${inviteList.length} Invitation${
                      inviteList.length !== 1 ? "s" : ""
                    }`}
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 3: Overview */}
        {step === 3 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {familyCircle?.name}
            </Typography>

            {/* Show invitation results if available */}
            {invitationResults.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Invitation Results:
                </Typography>
                {invitationResults.map((result, idx) => (
                  <Alert
                    key={idx}
                    severity={result.success ? "success" : "error"}
                    icon={result.success ? <CheckCircle /> : <ErrorIcon />}
                    sx={{ mb: 1 }}
                  >
                    <strong>{result.email}</strong> -{" "}
                    {result.success ? "Invitation sent" : result.error}
                  </Alert>
                ))}
              </Box>
            )}

            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Members:
            </Typography>
            {familyCircle?.members && familyCircle.members.length > 0 ? (
              <List>
                {familyCircle.members.map((m) => (
                  <ListItem
                    key={m._id}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <ListItemText primary={m.name} secondary={m.email} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                You are the first member of this circle.
              </Typography>
            )}

            {pendingInvitations.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Pending Invitations ({pendingInvitations.length})
                </Typography>
                <Grid container spacing={2}>
                  {pendingInvitations.map((invite) => (
                    <Grid item xs={12} sm={6} key={invite._id}>
                      <Alert severity="info" icon={<Email />}>
<<<<<<< HEAD
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {invite.email}
                        </Typography>
=======
                        <Typography variant="body2">{invite.email}</Typography>
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
                        <Typography variant="caption" color="text.secondary">
                          Invited by {invite.invitedBy?.name}
                        </Typography>
                      </Alert>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

<<<<<<< HEAD
            <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate(`/family-circle/${familyCircle._id}`)}
              >
                Go to Circle Page
              </Button>
            </Box>
=======
            <Button
              sx={{ mt: 3 }}
              variant="contained"
              onClick={() => navigate(`/family-circle/${familyCircle._id}`)}
            >
              Go to Circle Page
            </Button>
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default FamilyCircleWizard;
