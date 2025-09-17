// server.js (update the database connection part)
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Routes and DB connection
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const connectDB = require('./config/database'); // Import the connection function

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World! OpenDoor Server is running!');
});
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// server.js (update the cors middleware)
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

// Database connection and server start
connectDB() // Use the centralized connection function
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });