import mongoose from "mongoose";

<<<<<<< HEAD
const StorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A story must have a title."],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "A story cannot be empty"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    familyCircle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Family",
      required: true,
    },
    eventDate: {
      type: Date,
    },
    // ✅ ADD THIS - Tags field for manual and combined tags
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Add text search index for better searching
StorySchema.index({ title: "text", content: "text" });
StorySchema.index({ familyCircle: 1, createdAt: -1 });
StorySchema.index({ eventDate: -1 });

const Story = mongoose.model("Story", StorySchema);

export default Story;
=======
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
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
