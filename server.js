const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const app = express();

// Load environment variables
dotenv.config();

// Body Parser Middleware
app.use(bodyParser.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
const searchRoutes = require('./routes/searchRoutes');
const blogRoutes = require('./routes/blogRoutes');

// Use routes
app.use('/api', authRoutes);  // Authentication routes
app.use('/api', searchRoutes);  // Search routes
app.use('/api', blogRoutes);  // Blog routes

// Default port setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
