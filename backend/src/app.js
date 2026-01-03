const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const articleRoutes = require('./routes/article.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);

// Error Handling
app.use(errorHandler);

module.exports = app;
