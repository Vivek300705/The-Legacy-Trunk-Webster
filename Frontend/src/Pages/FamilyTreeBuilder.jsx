import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { AccountTree, Person, FamilyRestroom, Save } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  sendRelationshipRequest,
  getPendingRequests,
  respondToRequest,
  getFamilyMembers,
} from "../api/services";

const FamilyTreeBuilder = () => {
  const { circleId } = useParams();
  const navigate = useNavigate();
  const mongoUser = useSelector((state) => state.auth.mongoUser);

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedRelative, setSelectedRelative] = useState("");
  const [relationshipType, setRelationshipType] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch pending requests
        const requests = await getPendingRequests();
        setPendingRequests(requests);

        // Fetch family members if circleId is available
        if (circleId) {
          const members = await getFamilyMembers(circleId);
          setFamilyMembers(members);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
        setSnackbar({
          open: true,
          message: err.response?.data?.message || "Failed to load data",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [circleId]);

  const handlePersonClick = (person) => {
    setSelectedPerson(person);
    setSelectedRelative("");
    setRelationshipType("");
  };

  const handleSaveRelationship = async () => {
    if (selectedPerson && selectedRelative && relationshipType) {
      try {
        await sendRelationshipRequest(selectedRelative, relationshipType);
        setSnackbar({
          open: true,
          message: "Relationship request sent successfully!",
          severity: "success",
        });
        setSelectedRelative("");
        setRelationshipType("");
      } catch (err) {
        setSnackbar({
          open: true,
          message: err.response?.data?.message || "Failed to send request",
          severity: "error",
        });
      }
    }
  };

  const handleRespond = async (requestId, action) => {
    try {
      await respondToRequest(requestId, action);
      setSnackbar({
        open: true,
        message: `Request ${action}ed successfully!`,
        severity: "success",
      });
      setPendingRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to update request",
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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <AccountTree sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Family Tree Builder
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Build your family tree by defining relationships between family
          members
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Left Panel - Members List */}
        <Paper sx={{ flex: "0 0 350px", p: 3, height: "fit-content" }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Family Members
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {familyMembers.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 3 }}
            >
              No family members found. Invite members to your family circle
              first.
            </Typography>
          ) : (
            <List>
              {familyMembers.map((member) => (
                <ListItem
                  key={member._id}
                  button
                  selected={selectedPerson?._id === member._id}
                  onClick={() => handlePersonClick(member)}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    "&.Mui-selected": {
                      bgcolor: "primary.light",
                      "&:hover": {
                        bgcolor: "primary.light",
                      },
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {member.name?.charAt(0) || "U"}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={member.name}
                    secondary={member.email}
                    secondaryTypographyProps={{ noWrap: true }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        {/* Right Panel - Relationship Editor */}
        <Paper sx={{ flex: 1, p: 4 }}>
          {selectedPerson ? (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <FamilyRestroom
                  sx={{ fontSize: 32, color: "primary.main", mr: 2 }}
                />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Define Relationships for {selectedPerson.name}
                </Typography>
              </Box>

              <Divider sx={{ mb: 4 }} />

              {/* Relationship Form */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Add Relationship
                </Typography>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Select Family Member</InputLabel>
                  <Select
                    value={selectedRelative}
                    onChange={(e) => setSelectedRelative(e.target.value)}
                    label="Select Family Member"
                  >
                    {familyMembers
                      .filter(
                        (m) =>
                          m._id !== selectedPerson._id &&
                          m._id !== mongoUser?._id
                      )
                      .map((member) => (
                        <MenuItem key={member._id} value={member._id}>
                          {member.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Relationship Type</InputLabel>
                  <Select
                    value={relationshipType}
                    onChange={(e) => setRelationshipType(e.target.value)}
                    label="Relationship Type"
                    disabled={!selectedRelative}
                  >
                    <MenuItem value="Parent">Parent</MenuItem>
                    <MenuItem value="Child">Child</MenuItem>
                    <MenuItem value="Spouse">Spouse</MenuItem>
                    <MenuItem value="Sibling">Sibling</MenuItem>
                    <MenuItem value="Grandparent">Grandparent</MenuItem>
                    <MenuItem value="Grandchild">Grandchild</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<Save />}
                  onClick={handleSaveRelationship}
                  disabled={!selectedRelative || !relationshipType}
                >
                  Send Relationship Request
                </Button>
              </Box>

              {/* Pending Requests */}
              <Divider sx={{ mb: 3 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Pending Requests
              </Typography>
              {pendingRequests.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {pendingRequests.map((req) => (
                    <Paper
                      key={req._id}
                      sx={{ p: 2, bgcolor: "background.default" }}
                    >
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>{req.requester?.name}</strong> wants to connect
                        as your <strong>{req.relationshipType}</strong>
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handleRespond(req._id, "approved")}
                        >
                          Accept
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleRespond(req._id, "rejected")}
                        >
                          Reject
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No pending requests
                </Typography>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 400,
                textAlign: "center",
              }}
            >
              <Person sx={{ fontSize: 100, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Select a family member from the left panel to define their
                relationships
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

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
  );
};

export default FamilyTreeBuilder;
