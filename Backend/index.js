import express from "express";
import dotenv from "dotenv";
dotenv.config();
console.log('--- Checking Environment Variables ---');
console.log('MONGO_URI Loaded:', process.env.MONGO_URI ? 'Yes' : 'No');
console.log('OPENAI_API_KEY Loaded:', process.env.OPENAI_API_KEY ? 'Yes' : 'No');
console.log('------------------------------------');
import mongoose from "mongoose";
import cors from "cors";
import admin from "firebase-admin";
import { createRequire } from "module";

import familyCircleRoutes from "./src/routes/familyCircleRoutes.js";
import relationshipRoutes from "./src/routes/relationshipRoutes.js";
import storyRoutes from "./src/routes/storyRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import mediaRoutes from "./src/routes/mediaRoutes.js"; // ✅ Add this import
import searchRoutes from "./src/routes/searchRoutes.js";
import promptRoutes from './src/routes/promptRoutes.js';

// Import your service account key for Firebase using createRequire
const require = createRequire(import.meta.url);
const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};

const app = express();

// Middlewares
app.use(
  cors({
    origin: [
      "https://the-legacy-trunk-webster-4oyf-vivek300705s-projects.vercel.app", // ✅ Your actual Vercel URL
      "https://the-legacy-trunk-webster-4oyf.vercel.app", // ✅ Alternative Vercel URL
      "http://localhost:5173", // ✅ Vite dev server
      "http://localhost:3000",
    ],
    credentials: true,
  })
);
app.use(express.json()); // To parse JSON request bodies

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/family-circles", familyCircleRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/user", userRoutes);
app.use("/api/media", mediaRoutes); // ✅ Add this line
app.use("/api/search", searchRoutes); // ✅ Add search routes
app.use("/api/prompts", promptRoutes);
// app.get('/api/prompts/random', (req, res) => {
//   console.log('--- /api/prompts/random TEST ROUTE WAS HIT! ---');
//   res.json({ question: 'This is a successful test from index.js' });
// });
// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Family Legacy API is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  // Handle Multer errors
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File too large. Maximum size is 50MB." });
    }
    return res.status(400).json({ message: err.message });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { error: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}`);
});
