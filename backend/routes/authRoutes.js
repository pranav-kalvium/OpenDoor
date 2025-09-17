// routes/authRoutes.js
const express = require('express');
const { signup, login } = require('../controllers/authController'); // Import the functions from the controller

// Create a new router object
const router = express.Router();

// Define the routes
// POST /api/auth/signup -> goes to the signup controller function
// POST /api/auth/login -> goes to the login controller function
router.post('/signup', signup);
router.post('/login', login);

// Export the router so we can use it in our server.js
module.exports = router;