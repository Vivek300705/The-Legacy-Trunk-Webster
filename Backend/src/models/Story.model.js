import mongoose from "mongoose";

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A story must have a title.'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'A story cannot be empty.'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  familyCircle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: true,
  },
  eventDate: {
    type: Date,
  },
  // 👇 ADD THESE TWO NEW FIELDS
  tags: {
    type: [String], // Defines an array of strings
    default: [],    // Defaults to an empty array
  },
  category: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

const Story = mongoose.model('Story', StorySchema);

export default Story;