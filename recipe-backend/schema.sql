-- Main table per requirements
CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cuisine VARCHAR(100),
  title VARCHAR(255),
  rating FLOAT,
  prep_time INT,
  cook_time INT,
  total_time INT,
  description TEXT,
  nutrients TEXT,         -- stored as JSON string
  serves VARCHAR(50)
);

-- Optional helper index for speed
CREATE INDEX IF NOT EXISTS idx_recipes_rating ON recipes (rating DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON recipes (cuisine);
CREATE INDEX IF NOT EXISTS idx_recipes_title ON recipes (title);
CREATE INDEX IF NOT EXISTS idx_recipes_total_time ON recipes (total_time);

-- Table for recipe ingredients
CREATE TABLE IF NOT EXISTS ingredients (    
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id INTEGER,
  name VARCHAR(255),
  amount VARCHAR(50),
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);  
