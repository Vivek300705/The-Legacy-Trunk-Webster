import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#D97706",
      light: "#FBBF24",
      dark: "#B45309",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#78716C",
      light: "#A8A29E",
      dark: "#57534E",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FFF7ED",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#44403C",
      secondary: "#78716C",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "3rem",
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: "2.5rem",
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0 2px 8px rgba(217, 119, 6, 0.1)",
    "0 4px 16px rgba(217, 119, 6, 0.12)",
    "0 8px 24px rgba(217, 119, 6, 0.15)",
    "0 12px 32px rgba(217, 119, 6, 0.18)",
    "0 16px 40px rgba(217, 119, 6, 0.2)",
    "0 20px 48px rgba(217, 119, 6, 0.22)",
    "0 24px 56px rgba(217, 119, 6, 0.24)",
    "0 2px 8px rgba(217, 119, 6, 0.1)",
    "0 4px 16px rgba(217, 119, 6, 0.12)",
    "0 8px 24px rgba(217, 119, 6, 0.15)",
    "0 12px 32px rgba(217, 119, 6, 0.18)",
    "0 16px 40px rgba(217, 119, 6, 0.2)",
    "0 20px 48px rgba(217, 119, 6, 0.22)",
    "0 24px 56px rgba(217, 119, 6, 0.24)",
    "0 28px 64px rgba(217, 119, 6, 0.26)",
    "0 32px 72px rgba(217, 119, 6, 0.28)",
    "0 36px 80px rgba(217, 119, 6, 0.3)",
    "0 40px 88px rgba(217, 119, 6, 0.32)",
    "0 44px 96px rgba(217, 119, 6, 0.34)",
    "0 48px 104px rgba(217, 119, 6, 0.36)",
    "0 52px 112px rgba(217, 119, 6, 0.38)",
    "0 56px 120px rgba(217, 119, 6, 0.4)",
    "0 60px 128px rgba(217, 119, 6, 0.42)",
    "0 64px 136px rgba(217, 119, 6, 0.44)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 24px",
        },
        contained: {
          boxShadow: "0 4px 12px rgba(217, 119, 6, 0.25)",
          "&:hover": {
            boxShadow: "0 6px 16px rgba(217, 119, 6, 0.3)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
          },
        },
      },
    },
  },
});
