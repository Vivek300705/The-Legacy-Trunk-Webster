import {
  Container,
  Box,
  Typography,
  Chip,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import { Person, CalendarToday, Label } from "@mui/icons-material";

const StoryDetail = () => {
  // Sample story data
  const story = {
    title: "Our Wedding Day - A Love Story",
    author: "Grandma Rose",
    date: "1985-06-15",
    tags: ["wedding", "milestone", "love", "family"],
    content: `It was a beautiful summer day when John and I said "I do." The sun was shining, the birds were singing, and our families surrounded us with so much love and joy.

I remember being so nervous that morning. My hands were shaking as my mother helped me into my dress - the same dress her mother had worn decades before. It felt like wearing a piece of family history, a connection to all the love stories that came before ours.

The ceremony was held in the small chapel where John's parents had married. As I walked down the aisle, I saw John waiting for me, and suddenly all my nervousness melted away. In that moment, I knew I was exactly where I was meant to be.

Our first dance was to "Unforgettable" by Nat King Cole. John held me close and whispered that he would love me forever. Fifty years later, he's kept that promise every single day.`,
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
        caption: "Our first dance as husband and wife",
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
        caption: "Cutting the cake together",
      },
    ],
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 6, backgroundColor: "#FFFBF5" }}>
      <Container maxWidth="md">
        <Paper
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 4,
            backgroundColor: "white",
          }}
        >
          {/* Header */}
          <Typography
            variant="h3"
            component="h1"
            sx={{
              mb: 3,
              fontWeight: 700,
              fontFamily: "Georgia, serif",
              color: "text.primary",
              lineHeight: 1.2,
            }}
          >
            {story.title}
          </Typography>

          {/* Metadata */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              mb: 4,
              pb: 4,
              borderBottom: "2px solid",
              borderColor: "divider",
            }}
          >
            <Chip
              icon={<Person />}
              label={`By ${story.author}`}
              sx={{
                backgroundColor: "primary.light",
                color: "white",
                fontWeight: 500,
              }}
            />
            <Chip
              icon={<CalendarToday />}
              label={new Date(story.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              variant="outlined"
              sx={{ borderColor: "primary.main", color: "text.primary" }}
            />
          </Stack>

          {/* Main Content */}
          <Box sx={{ mb: 4 }}>
            {story.content.split("\n\n").map((paragraph, index) => (
              <Typography
                key={index}
                variant="body1"
                sx={{
                  mb: 3,
                  fontSize: "1.1rem",
                  lineHeight: 1.8,
                  fontFamily: "Georgia, serif",
                  color: "text.primary",
                  textAlign: "justify",
                }}
              >
                {paragraph}
              </Typography>
            ))}
          </Box>

          {/* Media Gallery */}
          {story.media.length > 0 && (
            <Box sx={{ my: 5 }}>
              {story.media.map((item, index) => (
                <Box key={index} sx={{ mb: 4 }}>
                  {item.type === "image" && (
                    <Box>
                      <Box
                        component="img"
                        src={item.url}
                        alt={item.caption}
                        sx={{
                          width: "100%",
                          borderRadius: 2,
                          boxShadow: 3,
                          mb: 1,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          textAlign: "center",
                          fontStyle: "italic",
                          color: "text.secondary",
                          mt: 1,
                        }}
                      >
                        {item.caption}
                      </Typography>
                    </Box>
                  )}
                  {item.type === "video" && (
                    <Box>
                      <video
                        controls
                        style={{
                          width: "100%",
                          borderRadius: "8px",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        }}
                      >
                        <source src={item.url} type="video/mp4" />
                      </video>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          textAlign: "center",
                          fontStyle: "italic",
                          color: "text.secondary",
                          mt: 1,
                        }}
                      >
                        {item.caption}
                      </Typography>
                    </Box>
                  )}
                  {item.type === "audio" && (
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: "background.default",
                        borderRadius: 2,
                      }}
                    >
                      <audio controls style={{ width: "100%" }}>
                        <source src={item.url} type="audio/mpeg" />
                      </audio>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          textAlign: "center",
                          fontStyle: "italic",
                          color: "text.secondary",
                          mt: 2,
                        }}
                      >
                        {item.caption}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}

          <Divider sx={{ my: 4 }} />

          {/* Tags Section */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Label sx={{ color: "primary.main" }} />
              Related Tags
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {story.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  clickable
                  sx={{
                    backgroundColor: "primary.light",
                    color: "white",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "primary.main",
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default StoryDetail;
