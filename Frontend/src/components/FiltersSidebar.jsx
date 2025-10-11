import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

const FiltersSidebar = ({
  typeFilter,
  setTypeFilter,
  authorFilter,
  setAuthorFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}) => {
  return (
    <Box
      sx={{
        width: 250,
        p: 2,
        borderRight: "1px solid #ddd",
        backgroundColor: "#fff",
        borderRadius: 2,
      }}
    >
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Type</InputLabel>
        <Select
          value={typeFilter}
          label="Type"
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="story">Story</MenuItem>
          <MenuItem value="image">Image</MenuItem>
          <MenuItem value="video">Video</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Author</InputLabel>
        <Select
          value={authorFilter}
          label="Author"
          onChange={(e) => setAuthorFilter(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="self">My Stories</MenuItem>
          <MenuItem value="family">Family Members</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="From"
        type="date"
        fullWidth
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label="To"
        type="date"
        fullWidth
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
    </Box>
  );
};

export default FiltersSidebar;
