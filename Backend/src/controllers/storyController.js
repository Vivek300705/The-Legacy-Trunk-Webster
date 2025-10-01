import Story from '../models/Story.model.js';
import Media from '../models/Media.model.js'; // Import Media model for cascading delete

// This function creates a new story. (No changes)
export const createStory = async (req, res) => {
  const { title, content, eventDate } = req.body;
  const author = req.user;

  try {
    if (!author.familyCircle) {
      return res.status(400).json({ message: 'You must join or create a family to post a story.' });
    }

    const newStory = new Story({
      title,
      content,
      eventDate,
      author: author._id,
      familyCircle: author.familyCircle,
    });

    await newStory.save();
    res.status(201).json(newStory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating story', error });
  }
};

// This function gets all stories for a family. (No changes)
export const getStoriesForFamily = async (req, res) => {
  const user = req.user;

  try {
    if (!user.familyCircle) {
      return res.status(200).json([]);
    }

    const stories = await Story.find({ familyCircle: user.familyCircle })
      .populate('author', 'name profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stories', error });
  }
};

// --- NEW FUNCTIONS ---

// This new function allows the author to update a story.
export const updateStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { title, content, eventDate } = req.body;
    const user = req.user;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: 'Story not found.' });
    }

    if (story.author.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to edit this story.' });
    }

    const updatedStory = await Story.findByIdAndUpdate(
      storyId,
      { title, content, eventDate },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedStory);
  } catch (error) {
    res.status(500).json({ message: 'Error updating story', error });
  }
};

// This new function allows the author to delete a story.
export const deleteStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const user = req.user;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: 'Story not found.' });
    }

    if (story.author.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this story.' });
    }

    await Story.findByIdAndDelete(storyId);
    
    // Also deletes any media linked to this story
    await Media.deleteMany({ associatedStory: storyId });

    res.status(200).json({ message: 'Story and associated media deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting story', error });
  }
};