import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  MenuItem,
  Stack,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { Person, CalendarToday, Label, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
// 👇 1. Import the new API service function
import { getFamilyCircleStories, getUniqueTags } from "../api/services";

const Timeline = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
<<<<<<< HEAD
=======
  const [tags, setTags] = useState([]); // 👈 2. Add state for tags
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterPerson, setFilterPerson] = useState("all");
  const [filterDecade, setFilterDecade] = useState("all");
<<<<<<< HEAD
  const [filterTag, setFilterTag] = useState("all");

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const data = await getFamilyCircleStories(100, 0);
        setStories(data.stories || []);
      } catch (err) {
        console.error("Error fetching stories:", err);
        setError(err.response?.data?.message || "Failed to load stories");
=======
  const [filterTag, setFilterTag] = useState("all"); // Renamed from selectedTag for consistency

  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        setLoading(true);
        // 👇 3. Fetch both stories and tags at the same time
        const [storiesData, tagsData] = await Promise.all([
          getFamilyCircleStories(100, 0),
          getUniqueTags(),
        ]);
        setStories(storiesData.stories || []);
        setTags(tagsData || []);
      } catch (err) {
        console.error("Error fetching timeline data:", err);
        setError(err.response?.data?.message || "Failed to load timeline");
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
      } finally {
        setLoading(false);
      }
    };
<<<<<<< HEAD

    fetchStories();
  }, []);

  const filteredStories = stories.filter((story) => {
    const personMatch =
      filterPerson === "all" || story.author?.name === filterPerson;
    const storyYear = new Date(story.eventDate).getFullYear();
    const decade = Math.floor(storyYear / 10) * 10 + "s";
    const decadeMatch = filterDecade === "all" || decade === filterDecade;
    const tagMatch = filterTag === "all" || story.tags?.includes(filterTag);
=======
    fetchTimelineData();
  }, []);

  // 👇 4. Your filter logic is already correct and will now work with the new state
  const filteredStories = stories.filter((story) => {
    // Person filter
    const personMatch =
      filterPerson === "all" || story.author?.name === filterPerson;
    
    // Decade filter
    const storyYear = story.eventDate ? new Date(story.eventDate).getFullYear() : 0;
    const decade = Math.floor(storyYear / 10) * 10 + "s";
    const decadeMatch = filterDecade === "all" || decade === filterDecade;
    
    // Tag filter
    const tagMatch = filterTag === "all" || (story.tags && story.tags.includes(filterTag));
    
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
    return personMatch && decadeMatch && tagMatch;
  });

  const uniquePeople = [
    ...new Set(stories.map((s) => s.author?.name).filter(Boolean)),
  ];
  const uniqueDecades = [
    ...new Set(
      stories.map((s) => {
<<<<<<< HEAD
        const year = new Date(s.eventDate).getFullYear();
        return Math.floor(year / 10) * 10 + "s";
      })
    ),
  ].sort();
  const uniqueTags = [...new Set(stories.flatMap((s) => s.tags || []))];
=======
        if (!s.eventDate) return null;
        const year = new Date(s.eventDate).getFullYear();
        return Math.floor(year / 10) * 10 + "s";
      }).filter(Boolean)
    ),
  ].sort();
  
  // Note: We now use the 'tags' state variable to populate the dropdown
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{ minHeight: "100vh", py: 4, backgroundColor: "background.default" }}
    >
      <Container maxWidth="lg">
<<<<<<< HEAD
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
=======
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: "text.primary" }}>
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
            Family Timeline
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/story-editor")}
            size="large"
          >
            New Story
          </Button>
        </Box>

        {stories.length === 0 ? (
          <Card sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No stories yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start building your family timeline by creating your first story
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/story-editor")}
            >
              Create First Story
            </Button>
          </Card>
        ) : (
          <>
<<<<<<< HEAD
            {/* Filter Controls */}
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{ mb: 6 }}
            >
              <TextField
                select
                label="Filter by Person"
                value={filterPerson}
                onChange={(e) => setFilterPerson(e.target.value)}
                sx={{ flex: 1 }}
                size="small"
              >
                <MenuItem value="all">All People</MenuItem>
                {uniquePeople.map((person) => (
                  <MenuItem key={person} value={person}>
                    {person}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Filter by Decade"
                value={filterDecade}
                onChange={(e) => setFilterDecade(e.target.value)}
                sx={{ flex: 1 }}
                size="small"
              >
                <MenuItem value="all">All Decades</MenuItem>
                {uniqueDecades.map((decade) => (
                  <MenuItem key={decade} value={decade}>
                    {decade}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Filter by Tag"
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                sx={{ flex: 1 }}
                size="small"
              >
                <MenuItem value="all">All Tags</MenuItem>
                {uniqueTags.map((tag) => (
                  <MenuItem key={tag} value={tag}>
                    {tag}
                  </MenuItem>
=======
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 6 }}>
              {/* Person Filter (no changes) */}
              <TextField select label="Filter by Person" value={filterPerson} onChange={(e) => setFilterPerson(e.target.value)} sx={{ flex: 1 }} size="small">
                <MenuItem value="all">All People</MenuItem>
                {uniquePeople.map((person) => (
                  <MenuItem key={person} value={person}>{person}</MenuItem>
                ))}
              </TextField>

              {/* Decade Filter (no changes) */}
              <TextField select label="Filter by Decade" value={filterDecade} onChange={(e) => setFilterDecade(e.target.value)} sx={{ flex: 1 }} size="small">
                <MenuItem value="all">All Decades</MenuItem>
                {uniqueDecades.map((decade) => (
                  <MenuItem key={decade} value={decade}>{decade}</MenuItem>
                ))}
              </TextField>

              {/* 👇 5. Tag Filter now populates from the 'tags' state */}
              <TextField select label="Filter by Tag" value={filterTag} onChange={(e) => setFilterTag(e.target.value)} sx={{ flex: 1 }} size="small">
                <MenuItem value="all">All Tags</MenuItem>
                {tags.map((tag) => (
                  <MenuItem key={tag} value={tag}>{tag}</MenuItem>
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
                ))}
              </TextField>
            </Stack>

<<<<<<< HEAD
            {/* Timeline */}
            <Box sx={{ position: "relative", pl: { xs: 2, md: 0 } }}>
              {/* Central line */}
              <Box
                sx={{
                  position: "absolute",
                  left: { xs: 0, md: "50%" },
                  top: 0,
                  bottom: 0,
                  width: "2px",
                  backgroundColor: "primary.main",
                  opacity: 0.3,
                }}
              />

              {filteredStories.length === 0 ? (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 4 }}
                >
=======
            {/* ... The rest of your Timeline rendering logic remains exactly the same ... */}
            <Box sx={{ position: "relative", pl: { xs: 2, md: 0 } }}>
              <Box sx={{ position: "absolute", left: { xs: 0, md: "50%" }, top: 0, bottom: 0, width: "2px", backgroundColor: "primary.main", opacity: 0.3 }} />
              {filteredStories.length === 0 ? (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
                  No stories match your filters
                </Typography>
              ) : (
                filteredStories.map((story, index) => {
                  const isLeft = index % 2 === 0;
<<<<<<< HEAD
                  const storyYear = new Date(story.eventDate).getFullYear();
                  const decade = Math.floor(storyYear / 10) * 10 + "s";

                  return (
                    <Box
                      key={story._id}
                      sx={{
                        display: "flex",
                        justifyContent: {
                          xs: "flex-start",
                          md: isLeft ? "flex-start" : "flex-end",
                        },
                        mb: 4,
                        position: "relative",
                      }}
                    >
                      <Card
                        onClick={() => navigate(`/story-detail/${story._id}`)}
                        sx={{
                          width: { xs: "100%", md: "45%" },
                          borderRadius: 3,
                          transition:
                            "transform 0.3s ease, box-shadow 0.3s ease",
                          cursor: "pointer",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: 6,
                          },
                        }}
                      >
                        {story.media && story.media[0] && (
                          <CardMedia
                            component="img"
                            height="180"
                            image={story.media[0].fileUrl}
                            alt={story.title}
                          />
                        )}
                        <CardContent>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, mb: 1 }}
                          >
                            {story.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                            noWrap
                          >
                            {story.content?.substring(0, 100)}...
                          </Typography>

                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ mb: 2 }}
                            flexWrap="wrap"
                            gap={1}
                          >
                            <Chip
                              icon={<CalendarToday sx={{ fontSize: 16 }} />}
                              label={new Date(
                                story.eventDate
                              ).toLocaleDateString()}
                              size="small"
                              sx={{
                                backgroundColor: "primary.light",
                                color: "white",
                              }}
                            />
                            <Chip
                              icon={<Person sx={{ fontSize: 16 }} />}
                              label={story.author?.name || "Unknown"}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={decade}
                              size="small"
                              variant="outlined"
                            />
                          </Stack>

                          {story.tags && story.tags.length > 0 && (
                            <Stack
                              direction="row"
                              spacing={1}
                              flexWrap="wrap"
                              gap={1}
                            >
                              {story.tags.slice(0, 3).map((tag) => (
                                <Chip
                                  key={tag}
                                  icon={<Label sx={{ fontSize: 14 }} />}
                                  label={tag}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    borderColor: "primary.main",
                                    color: "primary.main",
                                  }}
                                />
                              ))}
                              {story.tags.length > 3 && (
                                <Chip
                                  label={`+${story.tags.length - 3}`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
=======
                  const storyYear = story.eventDate ? new Date(story.eventDate).getFullYear() : null;
                  const decade = storyYear ? Math.floor(storyYear / 10) * 10 + "s" : 'No Date';

                  return (
                    <Box key={story._id} sx={{ display: "flex", justifyContent: { xs: "flex-start", md: isLeft ? "flex-start" : "flex-end" }, mb: 4, position: "relative" }}>
                      <Card onClick={() => navigate(`/story-detail/${story._id}`)} sx={{ width: { xs: "100%", md: "45%" }, borderRadius: 3, transition: "transform 0.3s ease, box-shadow 0.3s ease", cursor: "pointer", "&:hover": { transform: "scale(1.05)", boxShadow: 6 } }}>
                        {story.media && story.media[0] && (
                          <CardMedia component="img" height="180" image={story.media[0].fileUrl} alt={story.title} />
                        )}
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{story.title}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }} noWrap>{story.content?.substring(0, 100)}...</Typography>
                          <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" gap={1}>
                            {story.eventDate && <Chip icon={<CalendarToday sx={{ fontSize: 16 }} />} label={new Date(story.eventDate).toLocaleDateString()} size="small" sx={{ backgroundColor: "primary.light", color: "white" }} />}
                            <Chip icon={<Person sx={{ fontSize: 16 }} />} label={story.author?.name || "Unknown"} size="small" variant="outlined" />
                            {storyYear && <Chip label={decade} size="small" variant="outlined" />}
                          </Stack>
                          {story.tags && story.tags.length > 0 && (
                            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                              {story.tags.slice(0, 3).map((tag) => (
                                <Chip key={tag} icon={<Label sx={{ fontSize: 14 }} />} label={tag} size="small" variant="outlined" sx={{ borderColor: "primary.main", color: "primary.main" }} />
                              ))}
                              {story.tags.length > 3 && <Chip label={`+${story.tags.length - 3}`} size="small" variant="outlined" />}
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
                            </Stack>
                          )}
                        </CardContent>
                      </Card>
<<<<<<< HEAD

                      {/* Timeline dot */}
                      <Box
                        sx={{
                          position: "absolute",
                          left: { xs: -6, md: "50%" },
                          top: "50%",
                          transform: {
                            xs: "translateY(-50%)",
                            md: "translate(-50%, -50%)",
                          },
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor: "primary.main",
                          border: "3px solid",
                          borderColor: "background.paper",
                        }}
                      />
=======
                      <Box sx={{ position: "absolute", left: { xs: -6, md: "50%" }, top: "50%", transform: { xs: "translateY(-50%)", md: "translate(-50%, -50%)" }, width: 12, height: 12, borderRadius: "50%", backgroundColor: "primary.main", border: "3px solid", borderColor: "background.paper" }} />
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
                    </Box>
                  );
                })
              )}
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

<<<<<<< HEAD
export default Timeline;
=======
export default Timeline;
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
