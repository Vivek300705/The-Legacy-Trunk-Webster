import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import familyCircleRoutes from './src/routes/familyCircleRoutes.js'
import relationshipRoutes from './src/routes/relationshipRoutes.js'
// Import your service account key for Firebase
import serviceAccount from './serviceAccountKey.json' with { type: 'json' };
import storyRoutes from './src/routes/storyRoutes.js'
// Import routes (we will create these next)
import authRoutes from './src/routes/authRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.error(err));

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/family-circles', familyCircleRoutes);
app.use('/api/stories', storyRoutes); 
app.use('/api/relationships', relationshipRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));