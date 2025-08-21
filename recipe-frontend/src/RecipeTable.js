import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Rating, TextField, Select, MenuItem, FormControl, InputLabel,
  Pagination, Typography, IconButton, Tooltip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { fetchRecipes, searchRecipes } from "./api";
import { truncate, opParam, timeOps, ratingOps, calorieOps } from "./utils";

export default function RecipeTable({ onSelect }) {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  // Field-level filters
  const [title, setTitle] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [totalTimeOp, setTotalTimeOp] = useState(">=");
  const [totalTimeVal, setTotalTimeVal] = useState("");
  const [ratingOp, setRatingOp] = useState(">=");
  const [ratingVal, setRatingVal] = useState("");
  const [calorieOp, setCalorieOp] = useState("<=");
  const [calorieVal, setCalorieVal] = useState("");

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((total || 0) / (limit || 1))),
    [total, limit]
  );

  async function loadPage(p = page, l = limit) {
    setLoading(true);
    try {
      const data = await fetchRecipes(p, l);
      setRows(data.data);
      setTotal(data.total);
      setIsSearch(false);
    } finally {
      setLoading(false);
    }
  }

  async function runSearch() {
    setLoading(true);
    try {
      const params = {
        title: title || undefined,
        cuisine: cuisine || undefined,
        total_time: opParam(totalTimeOp, totalTimeVal) || undefined,
        rating: opParam(ratingOp, ratingVal) || undefined,
        calories: opParam(calorieOp, calorieVal) || undefined
      };
      const data = await searchRecipes(params);
      setRows(data.data);
      setTotal(data.total || data.data.length);
      setIsSearch(true);
      setPage(1); // reset page for client-side view
    } finally {
      setLoading(false);
    }
  }

  function clearFilters() {
    setTitle("");
    setCuisine("");
    setTotalTimeOp(">=");
    setTotalTimeVal("");
    setRatingOp(">=");
    setRatingVal("");
    setCalorieOp("<=");
    setCalorieVal("");
    // Reload default listing
    loadPage(1, limit);
    setPage(1);
  }

  useEffect(() => {
    loadPage(1, limit);
  }, [limit]);

  useEffect(() => {
    if (!isSearch) loadPage(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // For search result lists (not paginated by backend), do simple client-side paging
  const pagedRows = useMemo(() => {
    if (!isSearch) return rows;
    const start = (page - 1) * limit;
    return rows.slice(start, start + limit);
  }, [rows, page, limit, isSearch]);

  useEffect(() => {
    if (isSearch) {
      // recompute total pages when limit changes for search results
      setPage(1);
    }
  }, [limit, isSearch]);

 

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>🍲 Recipe Explorer</Typography>

        {/* Filters */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 2, mb: 2 }}>
          <TextField label="Title" value= {title} onChange={(e) => setTitle(e.target.value)} />
          <TextField label="Cuisine" value={cuisine} onChange={(e) => setCuisine(e.target.value)} />

          <Box sx={{ display: "flex", gap: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Total Time Op</InputLabel>
              <Select label="Total Time Op" value={totalTimeOp} onChange={(e) => setTotalTimeOp(e.target.value)}>
                {timeOps.map((op) => <MenuItem key={op} value={op}>{op}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              type="number"
              label="Total Time (mins)"
              value={totalTimeVal}
              onChange={(e) => setTotalTimeVal(e.target.value)}
              fullWidth
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Rating Op</InputLabel>
              <Select label="Rating Op" value={ratingOp} onChange={(e) => setRatingOp(e.target.value)}>
                {ratingOps.map((op) => <MenuItem key={op} value={op}>{op}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              type="number" step="0.1"
              label="Rating"
              value={ratingVal}
              onChange={(e) => setRatingVal(e.target.value)}
              fullWidth
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Calories Op</InputLabel>
              <Select label="Calories Op" value={calorieOp} onChange={(e) => setCalorieOp(e.target.value)}>
                {calorieOps.map((op) => <MenuItem key={op} value={op}>{op}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              type="number"
              label="Calories"
              value={calorieVal}
              onChange={(e) => setCalorieVal(e.target.value)}
              fullWidth
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Search using filters">
            <IconButton color="primary" onClick={runSearch}><SearchIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Clear filters">
            <IconButton onClick={clearFilters}><ClearIcon /></IconButton>
          </Tooltip>

          <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
            <Typography>Rows per page:</Typography>
            <Select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
              {[15, 20, 30, 40, 50].map((n) => <MenuItem key={n} value={n}>{n}</MenuItem>)}
            </Select>
          </Box>
        </Box>
      </Paper>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Cuisine</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Total Time</TableCell>
              <TableCell>Serves</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading && pagedRows.map((r) => (
              <TableRow key={r.id} hover onClick={() => onSelect(r)} sx={{ cursor: "pointer" }}>
                <TableCell title={r.title}>{truncate(r.title, 30)}</TableCell>
                <TableCell>{r.cuisine || "-"}</TableCell>
                <TableCell><Rating value={Number(r.rating) || 0} precision={0.1} readOnly /></TableCell>
                <TableCell>{r.total_time ?? "-"}</TableCell>
                <TableCell>{r.serves || "-"}</TableCell>
              </TableRow>
            ))}

            {!loading && pagedRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Box sx={{ py: 4 }}>
                    <Typography variant="body1">No results found.</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try clearing filters or adjusting your search.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}

            {loading && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading…
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={isSearch ? Math.max(1, Math.ceil(rows.length / limit)) : totalPages}
          page={page}
          onChange={(_, p) => setPage(p)}
        />
      </Box>
    </Box>
  );
}
