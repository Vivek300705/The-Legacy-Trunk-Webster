import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  fileUrl: {
    type: String,
    required: true,
  },
  mediaType: {
    type: String,
    // The enum is updated to be more flexible.
    enum: ['photo', 'video', 'audio', 'document', 'file'],
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Link media to a specific story
  associatedStory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true,
  },
}, { timestamps: true });

const Media = mongoose.model('Media', mediaSchema);

export default Media;