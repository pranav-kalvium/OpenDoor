// scripts/inspectEvents.js
const mongoose = require('mongoose');
const Event = require('../models/Event');
const connectDB = require('../config/database');

const inspectEvents = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    const events = await Event.find({});
    console.log(`\n=== Found ${events.length} events ===\n`);

    events.forEach((event, index) => {
      console.log(`Event ${index + 1}: "${event.title}"`);
      console.log(`Location: ${event.location.name}`);
      console.log(`Coordinates: ${JSON.stringify(event.location.coordinates)}`);
      console.log(`Coordinates type: ${typeof event.location.coordinates}`);
      
      if (Array.isArray(event.location.coordinates)) {
        console.log(`Array length: ${event.location.coordinates.length}`);
        console.log(`Valid: ${event.location.coordinates.length === 2 && 
                      typeof event.location.coordinates[0] === 'number' && 
                      typeof event.location.coordinates[1] === 'number'}`);
      }
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

inspectEvents();