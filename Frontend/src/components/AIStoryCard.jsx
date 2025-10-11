import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { AutoAwesome, CalendarToday, Person } from "@mui/icons-material";

const AIStoryCard = ({ story, onClick }) => {
  const imageUrl =
    story.image || story.imageUrl || story.thumbnail || story.coverImage;

  return (
    <Card
      onClick={() => onClick(story)}
      sx={{
        borderRadius: 3,
        cursor: "pointer",
        transition: "all 0.3s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        border: "2px solid transparent",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          transform: "translateY(-8px)",
          borderColor: "primary.main",
        },
      }}
    >
      {/* AI Badge */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1,
          backgroundColor: "rgba(255,255,255,0.95)",
          borderRadius: 2,
          px: 1.5,
          py: 0.5,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <AutoAwesome sx={{ fontSize: 16, color: "primary.main" }} />
        <Typography variant="caption" fontWeight={700} color="primary">
          AI Match
        </Typography>
      </Box>

      {/* Image */}
      {imageUrl && (
        <CardMedia
          component="img"
          height="280"
          image={imageUrl}
          alt={story.title}
          sx={{ objectFit: "cover" }}
        />
      )}

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Title */}
        <Typography
          variant="h5"
          fontWeight={700}
          gutterBottom
          sx={{
            mb: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {story.title}
        </Typography>

        {/* Summary/Description */}
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.6,
          }}
        >
          {story.summary ||
            story.description ||
            story.content ||
            "AI-generated family memory story."}
        </Typography>

        {/* Tags */}
        {story.tags && story.tags.length > 0 && (
          <Box sx={{ mb: 2, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {story.tags.slice(0, 3).map((tag, idx) => (
              <Chip
                key={idx}
                label={tag}
                size="small"
                icon={<AutoAwesome sx={{ fontSize: 14 }} />}
                sx={{
                  height: 24,
                  fontSize: "0.75rem",
                  backgroundColor: "#e8f5e9",
                  color: "#2e7d32",
                }}
              />
            ))}
          </Box>
        )}

        {/* Metadata */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            pt: 2,
            borderTop: "1px solid #eee",
            fontSize: "0.875rem",
          }}
        >
          {story.author && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Person sx={{ fontSize: 18, color: "primary.main" }} />
              <Typography variant="body2" fontWeight={500}>
                {story.author}
              </Typography>
            </Box>
          )}

          {(story.date || story.createdAt) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarToday sx={{ fontSize: 18, color: "primary.main" }} />
              <Typography variant="body2">
                {new Date(story.date || story.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AIStoryCard;
