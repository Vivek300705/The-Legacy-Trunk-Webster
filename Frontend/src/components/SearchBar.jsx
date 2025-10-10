import {
  TextField,
  Stack,
  Typography,
  InputAdornment,
  Button,
} from "@mui/material";
import { Search, Clear } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  textLoading,
  setSearchParams,
  clearSearch,
  resultCount,
  hasActiveFilters,
  clearAllFilters,
}) => {
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    value.trim() ? setSearchParams({ q: value }) : setSearchParams({});
  };

  const handleClear = () => {
    clearSearch();
    setSearchParams({});
  };

  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      <TextField
        fullWidth
        placeholder="Search stories, events, people... (leave empty to show all)"
        value={searchQuery}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {textLoading && <CircularProgress size={20} />}
              {searchQuery && !textLoading && (
                <Clear
                  onClick={handleClear}
                  sx={{
                    cursor: "pointer",
                    color: "action.active",
                    "&:hover": { color: "error.main" },
                  }}
                />
              )}
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "white",
            "&:hover": {
              backgroundColor: "#fafafa",
            },
            "&.Mui-focused": {
              backgroundColor: "white",
            },
          },
        }}
      />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          {searchQuery ? (
            <>
              <strong>{resultCount}</strong> result{resultCount !== 1 && "s"}{" "}
              found for "{searchQuery}"
            </>
          ) : (
            <>
              Showing <strong>{resultCount}</strong>{" "}
              {resultCount === 1 ? "story" : "stories"}
            </>
          )}
        </Typography>
        {hasActiveFilters && (
          <Button
            size="small"
            startIcon={<Clear />}
            onClick={clearAllFilters}
            variant="outlined"
            color="error"
            sx={{ textTransform: "none" }}
          >
            Clear Filters
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default SearchBar;
