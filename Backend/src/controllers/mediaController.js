import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import Media from "../models/Media.model.js";
import Story from "../models/Story.model.js";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Helper function to determine the file type from its mimetype
const getFileType = (mimetype) => {
  if (mimetype.startsWith("image")) return "photo";
  if (mimetype.startsWith("video")) return "video";
  if (mimetype.startsWith("audio")) return "audio";
  if (mimetype.startsWith("text") || mimetype === "application/pdf") {
    return "document";
  }
  return "file";
};

export const uploadMedia = async (req, res) => {
  try {
    const { storyId } = req.params;
    const uploader = req.user;

    console.log("📤 Upload request received for story:", storyId);
    console.log("👤 Uploader:", uploader?._id, uploader?.email);
    console.log("👥 Uploader Family Circle:", uploader?.familyCircle);

    if (!req.file) {
      console.error("❌ No file in request");
      return res.status(400).json({ message: "No file uploaded." });
    }

    console.log("📁 File received:", {
      name: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });

    if (!storyId || !storyId.match(/^[0-9a-fA-F]{24}$/)) {
      console.error("❌ Invalid story ID format:", storyId);
      return res.status(400).json({ message: "Invalid story ID format." });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      console.error("❌ Story not found:", storyId);
      return res.status(404).json({ message: "Story not found." });
    }

    console.log("📖 Story found:", story._id);
    console.log("🏠 Story Family Circle:", story.familyCircle);

    if (!uploader.familyCircle) {
      console.error("❌ Uploader has no family circle");
      return res.status(403).json({
        message: "You must be part of a family circle to upload media.",
      });
    }

    if (story.familyCircle.toString() !== uploader.familyCircle.toString()) {
      console.error("❌ Permission denied - Family circle mismatch");
      return res.status(403).json({
        message: "You do not have permission to upload media to this story.",
      });
    }

    console.log("☁️  Uploading to Cloudinary...");

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: `family-legacy/stories/${storyId}`,
          timeout: 120000,
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("✅ Cloudinary upload success:", result.secure_url);
            resolve(result);
          }
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const mediaType = getFileType(req.file.mimetype);
    console.log("🎬 Media type determined:", mediaType);

    const mediaData = {
      fileUrl: result.secure_url,
      mediaType,
      description: req.body.description || "",
      uploader: uploader._id,
      associatedStory: storyId,
    };

    console.log("💾 Attempting to save media to database:", mediaData);

    const newMedia = new Media(mediaData);
    await newMedia.save();

    console.log("✅ Media saved to database:", newMedia._id);

    res.status(201).json({
      message: "Media uploaded successfully",
      media: newMedia,
    });
  } catch (error) {
    console.error("❌ Error uploading media:", error);
    console.error("Error stack:", error.stack);

    res.status(500).json({
      message: "Error uploading media",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};
