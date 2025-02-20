require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Import the database pool

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3001' })); // Allow frontend requests from port 3000

// API Route to fetch recipes for John Doe (user_id = 1)
app.get('/api/recipes', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM recipes WHERE user_id = 1'
    );
    res.status(200).json(rows); // Return the recipes
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching recipes' });
  }
});

// API Route to fetch a specific recipe by ID
app.get('/api/recipes/:id', async (req, res) => {
  const { id } = req.params; // Get the recipe ID from the URL
  try {
    const [rows] = await db.execute(
      'SELECT * FROM recipes WHERE id = ? AND user_id = 1', // Make sure the user_id is 1
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json(rows[0]); // Return the specific recipe
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching recipe details' });
  }
});

// API Route to create a new recipe
app.post('/api/recipes', async (req, res) => {
  const { title, ingredients, steps, pictures, user_id } = req.body;

  // Check if all required fields are provided
  if (!title || !ingredients || !steps || !pictures || !user_id) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Insert the new recipe into the database
    const result = await db.execute(
      'INSERT INTO recipes (title, ingredients, steps, pictures, user_id) VALUES (?, ?, ?, ?, ?)',
      [title, ingredients, steps, pictures, user_id]
    );

    // Send a response back with the newly created recipe ID
    res.status(201).json({ message: 'Recipe created successfully', recipeId: result[0].insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating recipe' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
