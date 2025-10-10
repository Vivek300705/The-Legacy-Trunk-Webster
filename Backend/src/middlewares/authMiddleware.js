import admin from 'firebase-admin';
import User from '../models/User.model.js';

// 👇 ADD THIS NEW "LIGHT" MIDDLEWARE
// Its only job is to verify the Firebase token.
export const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Unauthorized: No token provided.' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.firebaseUser = decodedToken; // Attach the decoded token
    next();
  } catch (error) {
    return res.status(403).send({ message: 'Unauthorized: Invalid token.' });
  }
};


// 👇 This is your existing "full" middleware for protected routes
const authMiddleware = async (req, res, next) => {
  try {
    // This re-uses the logic from our new middleware
    await verifyFirebaseToken(req, res, async () => {
      const user = await User.findOne({ firebaseUID: req.firebaseUser.uid });

      if (!user) {
        return res.status(404).send({ message: 'User not found in database. Please sync user first.' });
      }

      req.user = user;
      next();
    });
  } catch(error) {
     // verifyFirebaseToken will handle sending the response on token errors
  }
};

export default authMiddleware;