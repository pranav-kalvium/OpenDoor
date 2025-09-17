// routes/eventRoutes.js
const express = require('express');
const {
  getAllEvents,
  getEvent,
  createEvent,
} = require('../controllers/eventController'); // Import the controller functions

const router = express.Router();

// Define the routes

// Router -> Controller
// GET /api/events -> getAllEvents
// POST /api/events -> createEvent
router.route('/').get(getAllEvents).post(createEvent);

// GET /api/events/:id -> getEvent
router.route('/:id').get(getEvent);

// Export the router
module.exports = router;