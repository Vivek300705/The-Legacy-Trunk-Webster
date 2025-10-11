import multer from 'multer';

// We'll store the file in memory as a buffer before uploading to Cloudinary
// Configure multer for memory storage (required for Cloudinary buffer upload)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    // Accept images, videos, and audio files
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/") ||
      file.mimetype.startsWith("audio/")
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only images, videos, and audio are allowed."
        )
      );
    }
  },
});


export default upload;