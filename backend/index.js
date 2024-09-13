const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();
const port = 4000;


app.use(express.json());
app.use('*', cors());
// Landing page route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the landing page' });
});

// User registration
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {  name, email, password: hashedPassword },
    });

    res.status(201).json({ message: 'User created successfully', userId: user.id });
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
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

