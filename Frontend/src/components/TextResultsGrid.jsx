import { Box, Grid, Typography, CircularProgress, Paper } from "@mui/material";
import { SearchOff } from "@mui/icons-material";
import FiltersSidebar from "./FiltersSidebar";
import ResultCard from "./ResultCard";

const TextResultsGrid = ({
  textLoading,
  textResults,
  typeFilter,
  setTypeFilter,
  authorFilter,
  setAuthorFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  handleResultClick,
  searchQuery,
  hideFilters = false,
}) => {
  return (
    <Box sx={{ display: "flex", gap: 3, height: "100%" }}>
      {/* Fixed Sidebar - Non-scrollable */}
      {!hideFilters && (
        <Box sx={{ flexShrink: 0 }}>
          <FiltersSidebar
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            authorFilter={authorFilter}
            setAuthorFilter={setAuthorFilter}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
          />
        </Box>
      )}

      {/* Scrollable Results Grid */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          pr: 1,
          "&::-webkit-scrollbar": {
            width: "10px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#c1c1c1",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#a8a8a8",
            },
          },
        }}
      >
        {textLoading ? (
          <Paper
            elevation={0}
            sx={{
              textAlign: "center",
              mt: 4,
              p: 6,
              backgroundColor: "white",
              borderRadius: 3,
            }}
          >
            <CircularProgress size={60} thickness={4} />
            <Typography
              variant="h6"
              color="text.secondary"
              mt={3}
              fontWeight={500}
            >
              Searching for "{searchQuery}"
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Please wait while we find the best matches...
            </Typography>
          </Paper>
        ) : textResults.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 3,
            }}
          >
            {textResults.map((result, index) => (
              <Box key={result.id || result._id || index}>
                <ResultCard result={result} onClick={handleResultClick} />
              </Box>
            ))}
          </Box>
        ) : (
          <Paper
            elevation={0}
            sx={{
              textAlign: "center",
              mt: 5,
              p: 6,
              backgroundColor: "white",
              borderRadius: 3,
              border: "2px dashed #e0e0e0",
            }}
          >
            <SearchOff
              sx={{
                fontSize: 100,
                color: "text.disabled",
                mb: 2,
                opacity: 0.3,
              }}
            />
            <Typography variant="h5" fontWeight={700} gutterBottom>
              No results found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {searchQuery
                ? `No stories match "${searchQuery}". Try different keywords or remove filters.`
                : "Start typing to search for stories, events, or people."}
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default TextResultsGrid;
