import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { createRequire } from "module";

import familyCircleRoutes from "./src/routes/familyCircleRoutes.js";
import relationshipRoutes from "./src/routes/relationshipRoutes.js";
import storyRoutes from "./src/routes/storyRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

// Import your service account key for Firebase using createRequire
const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccountKey.json");

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
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
  .catch((err) => console.error(err));

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/family-circles", familyCircleRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
