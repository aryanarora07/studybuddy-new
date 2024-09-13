const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const prisma = new PrismaClient();
const port = 4000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Landing page route
app.get('/', async (req, res) => { 
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

// Authentication middleware
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

// Update user profile
app.post('/api/profile/update', authenticateToken, async (req, res) => {
  const { userId, name, major, subjects, availability, location, bio, studyPreference, profileVisibility, profilePicture } = req.body;

  try {
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { name }
    });

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

// Fetch user profile
app.get('/api/profile/:userId', authenticateToken, async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId: userId },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (profile) {
      res.json({ profile });
    } else {
      res.status(404).json({ error: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile', message: error.message });
  }
});

// Fetch study partners
app.get('/api/study-partners', authenticateToken, async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;

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

// Check authentication status
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

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
    console.log(`User joined room: ${roomName}`);
  });

  socket.on('leaveRoom', (roomName) => {
    socket.leave(roomName);
    console.log(`User left room: ${roomName}`);
  });

  socket.on('sendMessage', (data) => {
    io.to(data.roomName).emit('message', data.message);
  });

  socket.on('drawLine', (data) => {
    socket.to(data.roomName).emit('drawLine', data.line);
  });

  socket.on('updateDocument', (data) => {
    socket.to(data.roomName).emit('documentUpdate', data.content);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Add this new endpoint for creating/joining a room
app.post('/api/rooms', authenticateToken, async (req, res) => {
  const { roomName } = req.body;
  const userId = req.user.userId;

  try {
    const room = await prisma.room.upsert({
      where: { name: roomName },
      update: {
        participants: {
          connect: { id: userId }
        }
      },
      create: {
        name: roomName,
        participants: {
          connect: { id: userId }
        }
      },
      include: {
        participants: true
      }
    });

    res.status(200).json({ message: 'Joined room successfully', room });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(400).json({ error: 'Failed to join room', message: error.message });
  }
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

console.log('JWT_SECRET:', process.env.JWT_SECRET);


