// scripts/debugEvents.js
const mongoose = require('mongoose');
const Event = require('../models/Event');
const connectDB = require('../config/database');

const debugEvents = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    // Find all events
    const events = await Event.find({});
    console.log(`Found ${events.length} events`);

    events.forEach((event, index) => {
      console.log(`\n=== Event ${index + 1}: ${event.title} ===`);
      console.log('Full location object:', JSON.stringify(event.location, null, 2));
      console.log('Coordinates type:', typeof event.location.coordinates);
      console.log('Coordinates value:', event.location.coordinates);
    });

    process.exit(0);

  } catch (error) {
    console.error('Error debugging events:', error);
    process.exit(1);
  }
};

debugEvents();