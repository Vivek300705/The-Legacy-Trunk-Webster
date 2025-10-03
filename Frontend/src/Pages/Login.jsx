import { useState } from "react";
import { useAuth } from "../context/authContext";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
  doPasswordReset,
} from "../Firebase/auth";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import { Google } from "@mui/icons-material";

const Login = () => {
  // FIXED: Use Redux state instead of context
  const firebaseUser = useSelector((state) => state.auth.firebaseUser);
  const { userLoggedIn } = useAuth(); // Keep for compatibility if needed

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Forgot Password states
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSigningIn) return;

    setSigningIn(true);
    setErrorMessage("");
    try {
      await doSignInWithEmailAndPassword(email, password);
      // User data will be automatically synced by App.jsx onAuthStateChanged
    } catch (err) {
      console.error(err);
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password"
      ) {
        setErrorMessage("Invalid email or password. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        setErrorMessage("No account found with this email.");
      } else if (err.code === "auth/too-many-requests") {
        setErrorMessage("Too many failed attempts. Please try again later.");
      } else {
        setErrorMessage("Failed to sign in. Please try again.");
      }
    } finally {
      setSigningIn(false);
    }
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (isSigningIn) return;

    setSigningIn(true);
    setErrorMessage("");
    try {
      await doSignInWithGoogle();
      // User data will be automatically synced by App.jsx onAuthStateChanged
    } catch (err) {
      console.error(err);
      setErrorMessage("Google sign-in failed. Please try again.");
    } finally {
      setSigningIn(false);
    }
  };

  const handleForgotPasswordOpen = () => {
    setForgotPasswordOpen(true);
    setResetEmail(email);
    setResetSuccess(false);
    setResetError("");
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
    setResetEmail("");
    setResetSuccess(false);
    setResetError("");
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (isResetting) return;

    if (!resetEmail || !resetEmail.includes("@")) {
      setResetError("Please enter a valid email address.");
      return;
    }

    setIsResetting(true);
    setResetError("");
    setResetSuccess(false);

    try {
      await doPasswordReset(resetEmail);
      setResetSuccess(true);
      setResetError("");
      setTimeout(() => {
        handleForgotPasswordClose();
      }, 3000);
    } catch (err) {
      console.error(err);
      if (err.code === "auth/user-not-found") {
        setResetError("No account found with this email address.");
      } else if (err.code === "auth/invalid-email") {
        setResetError("Invalid email address format.");
      } else if (err.code === "auth/too-many-requests") {
        setResetError("Too many requests. Please try again later.");
      } else {
        setResetError("Failed to send reset email. Please try again.");
      }
      setResetSuccess(false);
    } finally {
      setIsResetting(false);
    }
  };

  // FIXED: Check both for compatibility
  if (firebaseUser || userLoggedIn) {
    return <Navigate to="/dashboard" replace={true} />;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" align="center" sx={{ fontWeight: 600, mb: 2 }}>
          Login
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={onSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            autoComplete="email"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            autoComplete="current-password"
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Button
              size="small"
              onClick={handleForgotPasswordOpen}
              sx={{
                textTransform: "none",
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              Forgot Password?
            </Button>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isSigningIn}
            sx={{ mt: 2 }}
          >
            {isSigningIn ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <Button
          fullWidth
          variant="outlined"
          size="large"
          startIcon={<Google />}
          onClick={onGoogleSignIn}
          disabled={isSigningIn}
          sx={{ mt: 2 }}
        >
          Continue with Google
        </Button>

        <Typography align="center" sx={{ mt: 3 }}>
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "#D97706",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign Up
          </Link>
        </Typography>
      </Paper>

      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotPasswordOpen}
        onClose={handleForgotPasswordClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Reset Your Password</DialogTitle>
        <DialogContent>
          {resetSuccess ? (
            <Alert severity="success" sx={{ mt: 1 }}>
              Password reset email sent! Check your inbox and follow the
              instructions to reset your password.
            </Alert>
          ) : (
            <>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, mt: 1 }}
              >
                Enter your email address and we'll send you a link to reset your
                password.
              </Typography>
              {resetError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {resetError}
                </Alert>
              )}
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                autoComplete="email"
                autoFocus
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleForgotPasswordClose} disabled={isResetting}>
            Cancel
          </Button>
          {!resetSuccess && (
            <Button
              variant="contained"
              onClick={handlePasswordReset}
              disabled={isResetting || !resetEmail}
            >
              {isResetting ? "Sending..." : "Send Reset Link"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login;
