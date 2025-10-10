import { useState, useEffect } from "react";
import {
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

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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

  const [typeFilter, setTypeFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

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
  };

  return (
    <Box
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
    </Box>
  );
};

export default SearchResults;
