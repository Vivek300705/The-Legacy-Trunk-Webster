import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
} from "@mui/material";
import { FamilyRestroom } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { createFamilyCircle } from "../api/services";

const CreateFamilyCircle = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const newCircle = await createFamilyCircle(name);
      navigate(`/family-circle/${newCircle._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create family circle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <FamilyRestroom sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Create Your Family Circle
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Choose a name for your family circle
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Family Circle Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
            placeholder="e.g., Smith Family"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || !name.trim()}
            sx={{ mt: 3 }}
          >
            {loading ? "Creating..." : "Create Family Circle"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateFamilyCircle;
