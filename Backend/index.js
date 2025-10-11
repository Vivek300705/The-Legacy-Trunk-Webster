import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import admin from "firebase-admin";
import { createRequire } from "module";

import familyCircleRoutes from "./src/routes/familyCircleRoutes.js";
import relationshipRoutes from "./src/routes/relationshipRoutes.js";
import storyRoutes from "./src/routes/storyRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import mediaRoutes from "./src/routes/mediaRoutes.js";
import searchRoutes from "./src/routes/searchRoutes.js";
import promptRoutes from "./src/routes/promptRoutes.js";
import storyAnalysisQueue from "./src/services/queueService.js";
import analysisRoutes from "./src/routes/analysisRoutes.js";
import exportRoutes from "./src/routes/exportRoutes.js";

dotenv.config();

// ✅ Debug environment variables
console.log('--- Checking Environment Variables ---');
console.log('MONGO_URI Loaded:', !!process.env.MONGO_URI);
console.log('OPENAI_API_KEY Loaded:', !!process.env.OPENAI_API_KEY);
console.log('REDIS_URL Loaded:', !!process.env.REDIS_URL);
console.log('------------------------------------');

// ✅ Firebase Setup
const require = createRequire(import.meta.url);
const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'), // 🔒 Fix multiline key
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};

const app = express();

// ✅ CORS setup
app.use(
  cors({
    origin: [
      "https://the-legacy-trunk-webster-4oyf-vivek300705s-projects.vercel.app",
      "https://the-legacy-trunk-webster-4oyf.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
      "https://the-legacy-trunk-webster-eta.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// ✅ Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected..."))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Use routes
app.use("/api/auth", authRoutes);
app.use("/api/family-circles", familyCircleRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/user", userRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/prompts", promptRoutes);
app.use('/api/export', exportRoutes);


// ✅ Health check
app.get("/", (req, res) => {
  res.json({
    message: "Family Legacy API is running",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large. Max 50MB." });
    }
    return res.status(400).json({ message: err.message });
  }
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { error: err.stack }),
  });
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ✅ Queue Initialization
const initializeQueue = () => {
  console.log("🚀 Initializing AI Analysis Queue...");

  const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
  console.log("📡 Using Redis URL:", redisUrl);

  storyAnalysisQueue.on("ready", () => {
    console.log("✅ AI Analysis Queue is ready and processing jobs");
  });

  storyAnalysisQueue.on("error", (error) => {
    console.error("❌ Queue Error:", error.message);
  });

  storyAnalysisQueue.on("failed", (job, err) => {
    console.error(`❌ Job ${job.id} failed:`, err.message);
  });

  storyAnalysisQueue.on("completed", (job) => {
    console.log(`✅ Job ${job.id} completed successfully`);
  });

  storyAnalysisQueue.on("stalled", (job) => {
    console.warn(`⚠️ Job ${job.id} stalled`);
  });
};

// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  try {
    initializeQueue();
  } catch (error) {
    console.error("Failed to initialize queue:", error);
    console.warn("⚠️ Auto-tagging feature disabled due to Redis issue.");
  }
});

// ✅ Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received: closing server...");
  await storyAnalysisQueue.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received: closing server...");
  await storyAnalysisQueue.close();
  process.exit(0);
});
