import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Root check route
app.get("/", (req, res) => {
  res.send("Backend API is running 🚀");
});

// Simple GET all recipes
app.get("/recipes", (req, res) => {
  const data = fs.readFileSync("recipes.json", "utf-8");
  const recipes = JSON.parse(data);

  // ✅ Pagination logic
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || recipes.length; // default: all
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginated = recipes.slice(startIndex, endIndex);

  res.json({
    total: recipes.length,
    page,
    limit,
    data: paginated,
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
