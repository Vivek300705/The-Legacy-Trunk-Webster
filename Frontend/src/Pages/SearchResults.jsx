import { useState, useEffect } from "react";
import {
<<<<<<< HEAD
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Search, AutoAwesome } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  searchContent,
  searchStoriesByTags,
  getAllTags,
} from "../api/services";
import StorySearchFilters from "../components/StorySearchFilters";
import SearchBar from "../components/SearchBar";
import TextResultsGrid from "../components/TextResultsGrid";
=======
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
  ListItemText,
  InputAdornment,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Search,
  Article,
  Event,
  Person,
  Image,
  FilterList,
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchContent } from "../api/services";
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
<<<<<<< HEAD

  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [textResults, setTextResults] = useState([]);
  const [textLoading, setTextLoading] = useState(false);
  const [textError, setTextError] = useState(null);

  const [aiResults, setAiResults] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState({
    themes: [],
    emotions: [],
    timePeriods: [],
    lifeStages: [],
  });

=======
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
  const [typeFilter, setTypeFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

<<<<<<< HEAD
  const hasActiveFilters =
    typeFilter !== "all" || dateFrom || dateTo || authorFilter !== "all";

  // Load tags
  useEffect(() => {
    getAllTags().then(setAvailableTags).catch(console.error);
  }, []);

  // Perform text search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === 0) performTextSearch();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, typeFilter, dateFrom, dateTo, activeTab]);

  const performTextSearch = async () => {
    try {
      setTextLoading(true);
      const data = await searchContent(searchQuery, {
        type: typeFilter !== "all" ? typeFilter : undefined,
        dateFrom,
        dateTo,
      });
      setTextResults(data?.results || data?.data || data || []);
    } catch (err) {
      setTextError("Failed to fetch results");
      setTextResults([]);
    } finally {
      setTextLoading(false);
    }
  };

  const performAiSearch = async (filters) => {
    setAiLoading(true);
    try {
      const results = await searchStoriesByTags(filters);
      setAiResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleResultClick = (r) => navigate(`/story-detail/${r.id || r._id}`);

  const clearAllFilters = () => {
    setTypeFilter("all");
    setAuthorFilter("all");
    setDateFrom("");
    setDateTo("");
=======
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, typeFilter, dateFrom, dateTo]);

  const performSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        type: typeFilter !== "all" ? typeFilter : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      };

      const data = await searchContent(searchQuery, filters);
      console.log("Search response:", data);
      setResults(data.results || []);
    } catch (err) {
      console.error("Search error:", err);
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || "Search query too short");
      } else {
        setError(
          err.response?.data?.message || "Failed to search. Please try again."
        );
      }
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  const authors = [
    "all",
    ...new Set(results.map((r) => r.author).filter(Boolean)),
  ];

  const filteredResults = results.filter((result) => {
    const authorMatch =
      authorFilter === "all" || result.author === authorFilter;
    return authorMatch;
  });

  const highlightText = (text, term) => {
    if (!term || !text) return text;
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

  const getIcon = (type) => {
    switch (type) {
      case "story":
        return Article;
      case "event":
        return Event;
      case "media":
        return Image;
      case "person":
        return Person;
      default:
        return Article;
    }
  };

  const handleResultClick = (result) => {
    // Navigate to story details page with storyId parameter
    navigate(`/story-detail/${result.id}`);
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
  };

  return (
    <Box
<<<<<<< HEAD
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "#FFF8F0",
      }}
    >
      {/* Fixed Header Section - Non-scrollable */}
      <Box
        sx={{
          flexShrink: 0,
          pt: 4,
          pb: 2,
          backgroundColor: "#FFF8F0",
        }}
      >
        <Container maxWidth="xl">
          {/* Title Section */}
          <Typography
            variant="h4"
            fontWeight={700}
            color="primary"
            gutterBottom
          >
            Search Family Stories
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Find memories using traditional search or AI-powered filters
          </Typography>

          {/* Tabs */}
          <Paper sx={{ mb: 3, borderRadius: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(e, v) => setActiveTab(v)}
              sx={{
                "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
              }}
            >
              <Tab icon={<Search />} label="Text Search" iconPosition="start" />
              <Tab
                icon={<AutoAwesome />}
                label="AI Smart Search"
                iconPosition="start"
              />
            </Tabs>
          </Paper>

          {/* Search Bar and Filters - Only for Text Search Tab */}
          {activeTab === 0 && (
            <>
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                textLoading={textLoading}
                setSearchParams={setSearchParams}
                clearSearch={() => setSearchQuery("")}
                resultCount={textResults.length}
                hasActiveFilters={hasActiveFilters}
                clearAllFilters={clearAllFilters}
              />

              {textError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {textError}
                </Alert>
              )}
            </>
          )}

          {/* AI Search Filters - Only for AI Tab */}
          {activeTab === 1 && (
            <StorySearchFilters
              onResults={setAiResults}
              onSearch={performAiSearch}
              availableTags={availableTags}
              loading={aiLoading}
            />
          )}
        </Container>
      </Box>

      {/* Results Section - Scrollable only for story cards */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          pb: 4,
        }}
      >
        <Container maxWidth="xl" sx={{ height: "100%" }}>
          {/* Text Search Results */}
          {activeTab === 0 && (
            <TextResultsGrid
              textLoading={textLoading}
              textResults={textResults}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              authorFilter={authorFilter}
              setAuthorFilter={setAuthorFilter}
              dateFrom={dateFrom}
              setDateFrom={setDateFrom}
              dateTo={dateTo}
              setDateTo={setDateTo}
              handleResultClick={handleResultClick}
              searchQuery={searchQuery}
            />
          )}

          {/* AI Search Results */}
          {activeTab === 1 && (
            <Box>
              {aiLoading ? (
                <Box sx={{ textAlign: "center", mt: 4 }}>
                  <CircularProgress size={60} />
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    mt={3}
                    fontWeight={500}
                  >
                    Searching with AI...
                  </Typography>
                </Box>
              ) : aiResults.length > 0 ? (
                <>
                  <Typography variant="h6" fontWeight={600} mb={3}>
                    {aiResults.length} AI-matched stor
                    {aiResults.length === 1 ? "y" : "ies"} found
                  </Typography>
                  <TextResultsGrid
                    textLoading={false}
                    textResults={aiResults}
                    typeFilter={typeFilter}
                    setTypeFilter={setTypeFilter}
                    authorFilter={authorFilter}
                    setAuthorFilter={setAuthorFilter}
                    dateFrom={dateFrom}
                    setDateFrom={setDateFrom}
                    dateTo={dateTo}
                    setDateTo={setDateTo}
                    handleResultClick={handleResultClick}
                    searchQuery=""
                    hideFilters={true}
                  />
                </>
              ) : (
                <Paper
                  sx={{
                    p: 6,
                    textAlign: "center",
                    mt: 4,
                    borderRadius: 3,
                    border: "2px dashed #e0e0e0",
                  }}
                >
                  <AutoAwesome
                    sx={{
                      fontSize: 100,
                      color: "primary.main",
                      mb: 2,
                      opacity: 0.3,
                    }}
                  />
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    Apply AI Filters Above
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mt={1}>
                    Select filters to discover stories using AI-powered search
                  </Typography>
                </Paper>
              )}
            </Box>
          )}
        </Container>
      </Box>
=======
      sx={{ minHeight: "100vh", py: 4, backgroundColor: "background.default" }}
    >
      <Container maxWidth="xl">
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <TextField
            fullWidth
            placeholder="Search stories and events..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
              endAdornment: loading && (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
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
            {loading ? (
              "Searching..."
            ) : (
              <>
                {filteredResults.length} result
                {filteredResults.length !== 1 ? "s" : ""} found
                {searchQuery && (
                  <>
                    {" "}
                    for "<strong>{searchQuery}</strong>"
                  </>
                )}
                {!searchQuery && " (showing all)"}
              </>
            )}
          </Typography>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
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
                  {["all", "story", "event"].map((type) => (
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

              {authors.length > 1 && (
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}
                  >
                    Author
                  </Typography>
                  <List dense>
                    {authors.map((author) => (
                      <ListItemButton
                        key={author}
                        selected={authorFilter === author}
                        onClick={() => setAuthorFilter(author)}
                        sx={{ borderRadius: 2 }}
                      >
                        <ListItemText
                          primary={author === "all" ? "All" : author}
                          primaryTypographyProps={{
                            fontWeight: authorFilter === author ? 600 : 400,
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Box>
              )}

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
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    size="small"
                    label="To"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={9}>
            {loading && filteredResults.length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : filteredResults.length === 0 && !loading ? (
              <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
                <Search sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {searchQuery ? "No results found" : "No stories yet"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchQuery
                    ? "Try adjusting your search terms or filters"
                    : "Start creating stories to see them appear here"}
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={3}>
                {filteredResults.map((result) => {
                  const IconComponent = getIcon(result.type);
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
                      onClick={() => handleResultClick(result)}
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
                              flexShrink: 0,
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
                              {result.date && (
                                <Typography
                                  variant="caption"
                                  sx={{ color: "text.secondary" }}
                                >
                                  {new Date(result.date).toLocaleDateString()}
                                </Typography>
                              )}
                            </Stack>

                            <Typography
                              variant="h6"
                              sx={{
                                mb: 1,
                                fontWeight: 600,
                                color: "text.primary",
                              }}
                            >
                              {highlightText(result.title, searchQuery)}
                            </Typography>

                            {result.snippet && (
                              <Typography
                                variant="body2"
                                sx={{
                                  mb: 2,
                                  color: "text.secondary",
                                  lineHeight: 1.6,
                                }}
                              >
                                {highlightText(result.snippet, searchQuery)}
                              </Typography>
                            )}

                            {result.author && (
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
                            )}
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            )}
          </Grid>
        </Grid>
      </Container>
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
    </Box>
  );
};

export default SearchResults;
