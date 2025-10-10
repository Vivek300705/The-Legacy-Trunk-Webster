import User from '../models/User.model.js';

export const syncUser = async (req, res) => {
  const { name, email } = req.body;
  // req.firebaseUser comes from the 'verifyFirebaseToken' middleware
  const firebaseUID = req.firebaseUser.uid;

  try {
    let user = await User.findOne({ firebaseUID });

    if (user) {
      // User already exists, return their profile
      return res.status(200).json(user);
    }

    // If user doesn't exist, create them
    const newUser = new User({
      firebaseUID,
      email,
      name,
    });

    await newUser.save();
    res.status(201).json(newUser);

  } catch (error) {
    console.error("Error in syncUser:", error);
    res.status(500).json({ message: "Error syncing user", error });
  }
};


// 👇 ADD THIS NEW FUNCTION
// This gets the user profile that was already fetched by the full authMiddleware
export const getMyProfile = async (req, res) => {
  // If the 'authMiddleware' was successful, req.user contains the full user
  // document from your MongoDB database. We just send it back.
  res.status(200).json(req.user);
};