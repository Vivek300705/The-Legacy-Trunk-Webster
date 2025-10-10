import mongoose from "mongoose";

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
