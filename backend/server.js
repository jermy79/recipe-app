require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db'); // Import the database pool

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3001' })); // Allow frontend requests from port 3000

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

// API Route to create a new recipe for the logged-in user
app.post('/api/recipes', verifyToken, async (req, res) => {
  const { title, ingredients, steps } = req.body;
  const userId = req.userId;  // Get the user ID from the verified JWT token

  try {
    // Insert new recipe into the database
    const [result] = await db.execute(
      'INSERT INTO recipes (title, ingredients, steps, user_id) VALUES (?, ?, ?, ?)', 
      [title, ingredients, steps, userId]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating recipe' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
