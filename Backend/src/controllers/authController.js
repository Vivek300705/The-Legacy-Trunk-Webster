import User from '../models/User.model.js';

export const syncUser = async (req, res) => {
  const { name, email } = req.body;
  const firebaseUID = req.firebaseUser.uid; // Get UID from middleware

  try {
    // Check if the user already exists in your database
    let user = await User.findOne({ firebaseUID });

    if (user) {
      // User already exists, just send back their profile
      return res.status(200).json(user);
    }

    // If user does not exist, create a new one
    const newUser = new User({
      firebaseUID,
      email,
      name,
    });

    await newUser.save();
    res.status(201).json(newUser);

  } catch (error) {
    res.status(500).json({ message: "Error syncing user", error });
  }
};