import admin from 'firebase-admin';
import User from '../models/User.model.js'; // Import User model

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized: No token provided.');
  }
  // this line will simply give us the jwt token from header removing bearer and ' '
  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Find the user in YOUR database using the Firebase UID
    const user = await User.findOne({ firebaseUID: decodedToken.uid });

    // Attach both firebase info and your db user profile to the request
    req.user = user; // This now contains your full user document (_id, name, email, etc.)
    req.firebaseUser = decodedToken; // Contains the raw firebase token data
    
    next();
  } catch (error) {
    res.status(403).send('Unauthorized: Invalid token.');
  }
};

export default authMiddleware;