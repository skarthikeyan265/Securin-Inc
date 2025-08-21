const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // ✅ allow frontend to access backend

// your existing routes...
app.get("/recipes", (req, res) => {
  res.json({
    total: 2,
    page: 1,
    limit: 2,
    data: [
      {
        id: 1,
        title: "Pasta Carbonara",
        cuisine: "Italian",
        ingredients: ["Pasta", "Eggs", "Cheese", "Bacon"],
        instructions: "Boil pasta. Cook bacon. Mix with eggs and cheese.",
      },
      {
        id: 2,
        title: "Chicken Curry",
        cuisine: "Indian",
        ingredients: ["Chicken", "Onion", "Tomato", "Spices"],
        instructions: "Cook onion and tomato, add chicken, spices, simmer until done.",
      },
    ],
  });
});

app.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
});
