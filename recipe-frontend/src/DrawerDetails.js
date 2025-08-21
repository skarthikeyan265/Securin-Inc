import React, { useState } from "react";
import {
  Drawer, Box, Typography, IconButton, Table, TableBody, TableRow, TableCell
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function DrawerDetails({ open, onClose, recipe }) {
  const [showTimes, setShowTimes] = useState(false);

  if (!recipe) return null;

  const nutrients = recipe.nutrients || {};

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 420, p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6">
          {recipe.title} — {recipe.cuisine}
        </Typography>

        <Typography><b>Description:</b> {recipe.description || "-"}</Typography>

        <Box display="flex" alignItems="center" gap={1}>
          <Typography><b>Total Time:</b> {recipe.total_time ?? "-"} mins</Typography>
          <IconButton size="small" onClick={() => setShowTimes((s) => !s)}>
            {showTimes ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        {showTimes && (
          <Box sx={{ pl: 2 }}>
            <Typography>• Prep Time: {recipe.prep_time ?? "-"} mins</Typography>
            <Typography>• Cook Time: {recipe.cook_time ?? "-"} mins</Typography>
          </Box>
        )}

        <Typography variant="h6" sx={{ mt: 2 }}>Nutrition</Typography>
        <Table size="small">
          <TableBody>
            {[
              ["calories", "Calories"],
              ["carbohydrateContent", "Carbohydrates"],
              ["cholesterolContent", "Cholesterol"],
              ["fiberContent", "Fiber"],
              ["proteinContent", "Protein"],
              ["saturatedFatContent", "Saturated Fat"],
              ["sodiumContent", "Sodium"],
              ["sugarContent", "Sugar"],
              ["fatContent", "Fat"],
            ].map(([k, label]) => (
              <TableRow key={k}>
                <TableCell sx={{ width: 180 }}>{label}</TableCell>
                <TableCell>{nutrients[k] ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Drawer>
  );
}
