require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db'); // Import the database pool

const app = express();
const PORT = process.env.PORT || 4000;

const path = require('path');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save images to the /uploads folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`); // Unique filename
  }
});

const upload = multer({ storage });

// Ensure uploads folder exists
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3001', 'https://api.rezepe.com', 'https://76.82.216.194:3001','https://rezepe.com', 'http://192.168.1.247:3001' ]
}));

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = decoded.userId;
    next();
  });
};



// API Route to register a new user
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if email already exists
  const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  if (existingUser.length > 0) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Insert new user into database
    const result = await db.execute(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', 
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// API Route to log in a user
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  if (user.length === 0) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Compare the password
  const match = await bcrypt.compare(password, user[0].password_hash);
  if (!match) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

// API Route to fetch recipes for the logged-in user
app.get('/api/recipes', verifyToken, async (req, res) => {
  const userId = req.userId; // From the verified JWT token

  try {
    const [recipes] = await db.execute('SELECT * FROM recipes WHERE user_id = ?', [userId]);
    res.status(200).json(recipes); // Return recipes for the logged-in user
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching recipes' });
  }
});

// API Route to fetch a specific recipe by ID for the logged-in user
app.get('/api/recipes/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const [rows] = await db.execute('SELECT * FROM recipes WHERE id = ? AND user_id = ?', [id, userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json(rows[0]); // Return the specific recipe
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching recipe details' });
  }
});

// API Route to get the logged-in user details
app.get('/api/user', verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
      const [user] = await db.execute('SELECT id, name FROM users WHERE id = ?', [userId]);
      if (user.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ id: user[0].id, name: user[0].name });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching user details' });
  }
});

// Create a recipe with optional image upload
app.post('/api/recipes', verifyToken, upload.single('image'), async (req, res) => {
  const { title, ingredients, steps } = req.body;
  const userId = req.userId; // From JWT
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // Insert the new recipe, including the image path
    const [result] = await db.execute(
      'INSERT INTO recipes (title, ingredients, steps, user_id, pictures) VALUES (?, ?, ?, ?, ?)', 
      [title, ingredients, steps, userId, imagePath]
    );

    const recipeId = result.insertId;

    res.status(201).json({ id: recipeId, message: 'Recipe created successfully', imagePath });
  } catch (err) {
    console.error('Error creating recipe:', err);
    res.status(500).json({ message: 'Error creating recipe' });
  }
});



// API Route to update a recipe, including optional image upload
app.put('/api/recipes/:id', verifyToken, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { title, ingredients, steps } = req.body;
  const userId = req.userId; // Ensure only the owner can edit
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // Get the current recipe data from the database
    const [currentRecipe] = await db.execute('SELECT pictures FROM recipes WHERE id = ? AND user_id = ?', [id, userId]);
    
    if (currentRecipe.length === 0) {
      return res.status(404).json({ message: 'Recipe not found or unauthorized' });
    }

    // If a new image is uploaded, delete the old image from the filesystem
    if (imagePath && currentRecipe[0].pictures) {
      const oldImagePath = path.join(__dirname, currentRecipe[0].pictures);
      
      // Check if the old image file exists and delete it
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update the recipe in the database
    let query = 'UPDATE recipes SET title = ?, ingredients = ?, steps = ?';
    let params = [title, ingredients, steps];

    if (imagePath) {
      query += ', pictures = ?'; // Update the picture column if a new image is uploaded
      params.push(imagePath);
    }

    query += ' WHERE id = ? AND user_id = ?';
    params.push(id, userId);

    const [result] = await db.execute(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Recipe not found or unauthorized' });
    }

    res.status(200).json({ message: 'Recipe updated successfully', imagePath });
  } catch (err) {
    console.error('Error updating recipe:', err);
    res.status(500).json({ message: 'Error updating recipe' });
  }
});




// API Route to delete a recipe
app.delete('/api/recipes/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    // Get the recipe to check if it has an associated image
    const [recipe] = await db.execute('SELECT pictures FROM recipes WHERE id = ? AND user_id = ?', [id, userId]);

    if (recipe.length === 0) {
      return res.status(404).json({ message: 'Recipe not found or unauthorized' });
    }

    // If there's an image, delete it from the filesystem
    if (recipe[0].pictures) {
      const imagePath = path.join(__dirname, 'uploads', recipe[0].pictures.split('/')[2]);
      
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image:', err);
          // Optionally continue to delete the recipe even if the image can't be deleted
        }
      });
    }

    // Now, delete the recipe from the database
    const [result] = await db.execute('DELETE FROM recipes WHERE id = ? AND user_id = ?', [id, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Recipe not found or unauthorized' });
    }

    res.status(200).json({ message: 'Recipe and image deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting recipe' });
  }
});



// Serve static files (images, etc.) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d'  // Cache images for 1 day
}));

// Start Server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
