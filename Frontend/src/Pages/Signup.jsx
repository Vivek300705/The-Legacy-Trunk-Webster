import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Divider,
  Alert,
} from "@mui/material";
import { Google } from "@mui/icons-material";
import { useNavigate, Link, Navigate } from "react-router-dom";
// Import the necessary context hook and Firebase auth functions
import { useAuth } from "../context/authContext/index"; // Assuming this is your hook
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithGoogle,
} from "../Firebase/auth";

const Signup = () => {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignUp = async (e) => {
    e.preventDefault();
    setError("");

    // Prevent multiple submissions
    if (loading) return;

    // --- Validation ---
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await doCreateUserWithEmailAndPassword(email, password);
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email address is already in use.");
      } else {
        setError("Failed to create an account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");
    try {
      await doSignInWithGoogle();
      // Successful sign-in will trigger redirect
    } catch (err) {
      console.error(err);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      {userLoggedIn && <Navigate to={"/"} replace={true} />}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{ mb: 1, fontWeight: 700, color: "primary.main" }}
        >
          Create Your Account
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Start preserving your family's legacy today
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* The form's onSubmit was corrected */}
        <Box component="form" onSubmit={onSignUp}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            helperText="Must be at least 6 characters"
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>OR</Divider>

        <Button
          fullWidth
          variant="outlined"
          size="large"
          startIcon={<Google />}
          onClick={onGoogleSignIn} // Corrected casing
          disabled={loading}
          sx={{ mb: 2 }}
        >
          Continue with Google
        </Button>

        <Typography align="center" sx={{ mt: 3 }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#D97706",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Sign In
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Signup;
