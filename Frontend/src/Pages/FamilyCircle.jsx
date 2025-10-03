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
} from "@mui/material";
import {
  FamilyRestroom,
  Add,
  Delete,
  PersonAdd,
  ArrowForward,
  Email,
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

    setLoading(true);
    try {
      await Promise.all(
        inviteList.map((email) => inviteMember(familyCircle._id, email))
      );
      // Fetch updated invites
      const invites = await getCircleInvitations(familyCircle._id);
      setPendingInvitations(invites);
      // Load full circle info
      const updated = await getFamilyCircle(familyCircle._id);
      setFamilyCircle(updated);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Error sending invitations");
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
              endIcon={<ArrowForward />}
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
                <List>
                  {inviteList.map((email, i) => (
                    <ListItem key={i}>
                      <ListItemText primary={email} />
                      <ListItemSecondaryAction>
                        <IconButton
                          onClick={() => handleRemoveEmail(email)}
                          color="error"
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
                variant="contained"
                fullWidth
                disabled={loading}
                onClick={handleSendInvitations}
              >
                {loading
                  ? "Sending..."
                  : inviteList.length
                  ? `Send ${inviteList.length} Invitations`
                  : "Skip"}
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 3: Overview */}
        {step === 3 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {familyCircle?.name}
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Members:
            </Typography>
            <List>
              {familyCircle?.members?.map((m) => (
                <ListItem key={m._id}>
                  <ListItemText primary={m.name} secondary={m.email} />
                </ListItem>
              ))}
            </List>

            {pendingInvitations.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Pending Invitations ({pendingInvitations.length})
                </Typography>
                <Grid container spacing={2}>
                  {pendingInvitations.map((invite) => (
                    <Grid item xs={12} sm={6} key={invite._id}>
                      <Alert severity="info" icon={<Email />}>
                        <Typography variant="body2">{invite.email}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Invited by {invite.invitedBy?.name}
                        </Typography>
                      </Alert>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            <Button
              sx={{ mt: 3 }}
              variant="contained"
              onClick={() => navigate(`/family-circle/${familyCircle._id}`)}
            >
              Go to Circle Page
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default FamilyCircleWizard;
