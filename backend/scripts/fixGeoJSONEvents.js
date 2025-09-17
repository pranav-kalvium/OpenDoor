// scripts/fixGeoJSONEvents.js
const mongoose = require('mongoose');
const Event = require('../models/Event');
const connectDB = require('../config/database');

const fixGeoJSONEvents = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    const events = await Event.find({});
    console.log(`Found ${events.length} events`);

    let fixedCount = 0;

    for (const event of events) {
      // Check if coordinates are empty
      if (event.location.coordinates && 
          event.location.coordinates.coordinates && 
          event.location.coordinates.coordinates.length === 0) {
        
        console.log(`Fixing empty coordinates for: ${event.title}`);
        
        // Set proper coordinates based on event location
        const locationCoords = {
          'Washington Square Park': [-73.9973, 40.7309],
          'NYU Tandon School': [-73.9865, 40.6940],
          'Kimmel Center': [-73.9965, 40.7295],
          'NYU Athletic Center': [-73.9950, 40.7315],
          'NYU Steinhardt Gallery': [-73.9930, 40.7285]
        };

        const newCoords = locationCoords[event.location.name] || [-73.9965, 40.7295];
        
        event.location.coordinates.coordinates = newCoords;
        await event.save();
        fixedCount++;
        console.log(`   Set coordinates to: [${newCoords}]`);
      }
    }

    console.log(`\n✅ Fixed ${fixedCount} events with empty coordinates`);
    process.exit(0);

  } catch (error) {
    console.error('Error fixing events:', error);
    process.exit(1);
  }
};

fixGeoJSONEvents();