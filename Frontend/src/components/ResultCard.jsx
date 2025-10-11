import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { CalendarToday, Person, ImageOutlined } from "@mui/icons-material";

const ResultCard = ({ result, onClick }) => {
  // Get image from multiple possible sources
  let imageUrl =
    result.image || result.imageUrl || result.thumbnail || result.coverImage;

  // If no direct image, check media array for first image
  if (!imageUrl && result.media && result.media.length > 0) {
    const firstImage = result.media.find(
      (m) =>
        m.type === "image" ||
        m.mimeType?.startsWith("image/") ||
        m.mediaType === "photo"
    );
    if (firstImage) {
      imageUrl = firstImage.url || firstImage.fileUrl;
    }
  }

  // Get description/summary
  const description =
    result.description || result.summary || result.content || "";

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        height: "100%",
        minWidth: "270px",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        },
      }}
      onClick={() => onClick(result)}
    >
      {/* Image Section */}
      {imageUrl ? (
        <CardMedia
          component="img"
          height="280"
          image={imageUrl}
          alt={result.title || "Story image"}
          sx={{
            objectFit: "cover",
            backgroundColor: "#f5f5f5",
          }}
        />
      ) : (
        <Box
          sx={{
            height: 280,
            backgroundColor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999",
          }}
        >
          <ImageOutlined sx={{ fontSize: 80, opacity: 0.3 }} />
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Title */}
        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
          sx={{
            mb: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.3,
          }}
        >
          {result.title || "Untitled Story"}
        </Typography>

        {/* Description/Summary */}
        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>
        )}

        {/* Tags/Categories */}
        {result.tags && result.tags.length > 0 && (
          <Box sx={{ mb: 2, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {result.tags.slice(0, 3).map((tag, idx) => (
              <Chip
                key={idx}
                label={tag}
                size="small"
                sx={{
                  height: 24,
                  fontSize: "0.75rem",
                  backgroundColor: "#e3f2fd",
                  color: "#1976d2",
                }}
              />
            ))}
          </Box>
        )}

        {/* Metadata Footer */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            pt: 2,
            borderTop: "1px solid #eee",
            fontSize: "0.875rem",
            color: "text.secondary",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Person sx={{ fontSize: 18, color: "primary.main" }} />
            <Typography variant="body2" fontWeight={500}>
              {result.author ||
                result.authorName ||
                result.author?.name ||
                "Unknown"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarToday sx={{ fontSize: 18, color: "primary.main" }} />
            <Typography variant="body2">
              {new Date(
                result.date || result.createdAt || Date.now()
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
