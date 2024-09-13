const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();
const port = 4000;


app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend's URL
  credentials: true
}));

// Landing page route
app.get('/', async  (req, res) => { 
  res.json({ message: 'Welcome to the landing page' });
});

// User registration
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '6h' });

    res.status(201).json({
      message: 'User created successfully',
      userId: user.id,
      token: token
    });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed', message: error.message });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '6h' });
    res.json({ token, userId: user.id });
  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
});

// Update user profile completely
app.post('/api/profile/update', async (req, res) => {
    const { userId, major, subjects, availability, location, bio, studyPreference, profileVisibility, profilePicture } = req.body;
  
    try {
      const updatedProfile = await prisma.userProfile.upsert({
        where: { userId: parseInt(userId) },
        create: {
          userId: parseInt(userId),
          major,
          subjects,
          availability,
          location,
          bio,
          studyPreference,
          profileVisibility,
          profilePicture,
        },
        update: {
          major,
          subjects,
          availability,
          location,
          bio,
          studyPreference,
          profileVisibility,
          profilePicture,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });
  
      res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });
    } catch (error) {
      res.status(400).json({ error: 'Profile update failed', message: error.message });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });




// Add this middleware function for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Update the study partners route to use authentication
app.get('/api/study-partners', authenticateToken, async (req, res) => {
  try {
    const loggedInUserId = req.user.userId; // Now we can safely use the user ID from the token

    const studyPartners = await prisma.userProfile.findMany({
      where: {
        profileVisibility: true,
        userId: {
          not: loggedInUserId
        }
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        major: true,
        subjects: true,
        availability: true,
        location: true,
        bio: true,
        studyPreference: true,
        profilePicture: true,
      }
    });
    res.json(studyPartners);
  } catch (error) {
    console.error('Error fetching study partners:', error);
    res.status(500).json({ error: 'Failed to fetch study partners', message: error.message });
  }
});

// Add this new endpoint for checking authentication status
app.get('/api/auth/check', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true }
    });
    if (user) {
      res.json({ isLoggedIn: true, user });
    } else {
      res.json({ isLoggedIn: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to check authentication status' });
  }
});

// Add this new endpoint


