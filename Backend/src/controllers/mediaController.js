import cloudinary from '../config/cloudinaryConfig.js';
import Media from '../models/Media.model.js';
import Story from '../models/Story.model.js';

// Helper function to determine the file type from its mimetype
const getFileType = (mimetype) => {
  if (mimetype.startsWith('image')) return 'photo';
  if (mimetype.startsWith('video')) return 'video';
  if (mimetype.startsWith('audio')) return 'audio';
  if (mimetype.startsWith('text') || mimetype === 'application/pdf') {
    return 'document';
  }
  return 'file'; // A fallback for other file types
};

export const uploadMedia = async (req, res) => {
  try {
    const { storyId } = req.params;
    const uploader = req.user;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    
    const story = await Story.findById(storyId);
    if (!story || story.familyCircle.toString() !== uploader.familyCircle.toString()) {
      return res.status(404).json({ message: 'Story not found or you do not have permission.' });
    }

    const result = await new Promise((resolve, reject) => {
      // Note: Cloudinary's "resource_type: 'auto'" is what makes this possible!
      // It will correctly handle images, videos, and raw files (like text).
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });
    
    // **Use the helper function to get the correct mediaType**
    const mediaType = getFileType(req.file.mimetype);

    const newMedia = new Media({
      fileUrl: result.secure_url,
      mediaType, // Use the result from our helper function
      description: req.body.description || '',
      uploader: uploader._id,
      associatedStory: storyId,
    });

    await newMedia.save();

    res.status(201).json(newMedia);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading media', error });
  }
};