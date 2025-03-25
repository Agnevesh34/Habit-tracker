require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/authRoutes');
const habitRoutes = require('./routes/habits');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Base route
app.get('/', (req, res) => {
  res.send('Habit Tracker API is running...');
});

// Mount API routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);  // This line mounts the habits routes

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




