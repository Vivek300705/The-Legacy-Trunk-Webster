import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  Search,
  Article,
  Event,
  Person,
  Image,
  CalendarToday,
  FilterList,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("wedding");
  const [dateFilter, setDateFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Sample search results
  const searchResults = [
    {
      id: 1,
      type: "story",
      icon: Article,
      title: "Our Wedding Day - A Love Story",
      snippet:
        'It was a beautiful summer day when John and I said "I do." The sun was shining, the birds were singing, and our families surrounded us with so much love...',
      author: "Grandma Rose",
      date: "1985-06-15",
      matchedTerm: "wedding",
    },
    {
      id: 2,
      type: "event",
      icon: Event,
      title: "Wedding Anniversary Celebration",
      snippet:
        "Celebrating 50 years of marriage with a beautiful ceremony and family gathering. The wedding vows were renewed in front of all our children and grandchildren...",
      author: "Grandpa John",
      date: "2005-06-15",
      matchedTerm: "wedding",
    },
    {
      id: 3,
      type: "media",
      icon: Image,
      title: "Wedding Photo Album",
      snippet:
        "Collection of photos from the wedding day including the ceremony, reception, and family portraits. Special moments captured forever...",
      author: "Family Archive",
      date: "1985-06-15",
      matchedTerm: "wedding",
    },
    {
      id: 4,
      type: "person",
      icon: Person,
      title: "Rose Martinez Profile",
      snippet:
        "Grandmother, married to John Martinez. Wedding took place in 1985. Known for her amazing cooking and warm heart...",
      author: "Family Tree",
      date: "2020-01-10",
      matchedTerm: "wedding",
    },
  ];

  const filteredResults = searchResults.filter((result) => {
    const typeMatch = typeFilter === "all" || result.type === typeFilter;
    const authorMatch =
      authorFilter === "all" || result.author === authorFilter;
    return typeMatch && authorMatch;
  });

  const highlightText = (text, term) => {
    const parts = text.split(new RegExp(`(${term})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === term.toLowerCase() ? (
            <span
              key={i}
              style={{ backgroundColor: "#FBBF24", fontWeight: 600 }}
            >
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const getIconColor = (type) => {
    switch (type) {
      case "story":
        return "primary.main";
      case "event":
        return "secondary.main";
      case "media":
        return "info.main";
      case "person":
        return "success.main";
      default:
        return "text.secondary";
    }
  };

  return (
    <Box
      sx={{ minHeight: "100vh", py: 4, backgroundColor: "background.default" }}
    >
      <Container maxWidth="xl">
        {/* Search Bar */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <TextField
            fullWidth
            placeholder="Search stories, events, people, and media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: "1.1rem",
              },
            }}
          />
          <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
            {filteredResults.length} results found for "
            <strong>{searchQuery}</strong>"
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {/* Filters Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, borderRadius: 3, position: "sticky", top: 20 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 3 }}
              >
                <FilterList sx={{ color: "primary.main" }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Filters
                </Typography>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}
                >
                  Content Type
                </Typography>
                <List dense>
                  {["all", "story", "event", "media", "person"].map((type) => (
                    <ListItemButton
                      key={type}
                      selected={typeFilter === type}
                      onClick={() => setTypeFilter(type)}
                      sx={{ borderRadius: 2 }}
                    >
                      <ListItemText
                        primary={type.charAt(0).toUpperCase() + type.slice(1)}
                        primaryTypographyProps={{
                          fontWeight: typeFilter === type ? 600 : 400,
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}
                >
                  Author
                </Typography>
                <List dense>
                  {[
                    "all",
                    "Grandma Rose",
                    "Grandpa John",
                    "Family Archive",
                  ].map((author) => (
                    <ListItemButton
                      key={author}
                      selected={authorFilter === author}
                      onClick={() => setAuthorFilter(author)}
                      sx={{ borderRadius: 2 }}
                    >
                      <ListItemText
                        primary={
                          author.charAt(0).toUpperCase() + author.slice(1)
                        }
                        primaryTypographyProps={{
                          fontWeight: authorFilter === author ? 600 : 400,
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}
                >
                  Date Range
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    size="small"
                    label="From"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    size="small"
                    label="To"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
              </Box>
            </Paper>
          </Grid>

          {/* Results */}
          <Grid item xs={12} md={9}>
            <Stack spacing={3}>
              {filteredResults.map((result) => {
                const IconComponent = result.icon;
                return (
                  <Card
                    key={result.id}
                    sx={{
                      borderRadius: 3,
                      transition: "all 0.3s",
                      "&:hover": {
                        boxShadow: 6,
                        transform: "translateY(-2px)",
                      },
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/story-detail")}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" spacing={2}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            backgroundColor: getIconColor(result.type),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0.1,
                          }}
                        >
                          <IconComponent
                            sx={{
                              color: getIconColor(result.type),
                              fontSize: 28,
                            }}
                          />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                            sx={{ mb: 1 }}
                          >
                            <Chip
                              label={result.type}
                              size="small"
                              sx={{
                                backgroundColor: getIconColor(result.type),
                                color: "white",
                                fontWeight: 500,
                                textTransform: "capitalize",
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              {new Date(result.date).toLocaleDateString()}
                            </Typography>
                          </Stack>

                          <Typography
                            variant="h6"
                            sx={{
                              mb: 1,
                              fontWeight: 600,
                              color: "text.primary",
                            }}
                          >
                            {result.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              mb: 2,
                              color: "text.secondary",
                              lineHeight: 1.6,
                            }}
                          >
                            {highlightText(result.snippet, result.matchedTerm)}
                          </Typography>

                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Person
                              sx={{ fontSize: 16, color: "text.secondary" }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              {result.author}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SearchResults;
