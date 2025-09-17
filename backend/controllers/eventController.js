// controllers/eventController.js
const Event = require('../models/Event');

// CONTROLLER 1: Get all events
exports.getAllEvents = async (req, res) => {
  try {
    // 1) Filtering (Basic for now)
    // This creates a copy of the request's query parameters (...req.query)
    const queryObj = { ...req.query };
    
    // 2) Execute the query
    const events = await Event.find(queryObj); // Find all events that match the query

    // 3) Send response
    res.status(200).json({
      status: 'success',
      results: events.length,
      data: {
        events,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// CONTROLLER 2: Get a single event by its ID
exports.getEvent = async (req, res) => {
  try {
    // Find the event by the ID provided in the URL (req.params.id)
    const event = await Event.findById(req.params.id);

    // If no event is found, throw an error (handled by the catch block)
    if (!event) {
      throw new Error('No event found with that ID');
    }

    res.status(200).json({
      status: 'success',
      data: {
        event,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// CONTROLLER 3: Create a new event
exports.createEvent = async (req, res) => {
  try {
    // Create a new event document in the database from the request body
    const newEvent = await Event.create(req.body);

    // Send a 201 Created status with the new event data
    res.status(201).json({
      status: 'success',
      data: {
        event: newEvent,
      },
    });
  } catch (err) {
    // This will catch validation errors from our model (e.g., missing required fields)
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};