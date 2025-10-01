import Family from '../models/FamilyCircle.model.js';
import User from '../models/User.model.js';

export const createFamilyCircle = async (req, res) => {
  const { name } = req.body;
  // We can trust req.user exists because the middleware provides it.
  const user = req.user; 

  try {
    // The check is now clean and direct.
    if (user.familyCircle) {
      return res.status(400).json({ message: 'User is already in a family.' });
    }

    const newFamily = new Family({
      name,
      admin: user._id,
      members: [user._id],
    });
    await newFamily.save();

    await User.findByIdAndUpdate(user._id, { familyCircle: newFamily._id });

    res.status(201).json(newFamily);
  } catch (error) {
    res.status(500).json({ message: "Error creating family", error });
  }
};