// scripts/fixEvents.js
const mongoose = require('mongoose');
const Event = require('../models/Event');
const connectDB = require('../config/database');

const fixEventCoordinates = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    // Find all events
    const events = await Event.find({});
    console.log(`Found ${events.length} events`);

    let fixedCount = 0;
    let skippedCount = 0;

    for (const event of events) {
      try {
        console.log(`\nChecking event: ${event.title}`);
        console.log('Current location structure:', JSON.stringify(event.location, null, 2));

        let needsFix = false;
        let newCoordinates = null;

        // Case 1: coordinates is an array with invalid values
        if (Array.isArray(event.location.coordinates)) {
          if (event.location.coordinates.length !== 2 || 
              event.location.coordinates.some(coord => typeof coord !== 'number' || isNaN(coord))) {
            needsFix = true;
            newCoordinates = [-73.9965, 40.7295]; // [longitude, latitude]
          }
        }
        // Case 2: coordinates is an object with nested coordinates (GeoJSON)
        else if (event.location.coordinates && typeof event.location.coordinates === 'object') {
          if (event.location.coordinates.coordinates && 
              Array.isArray(event.location.coordinates.coordinates) &&
              event.location.coordinates.coordinates.length === 2) {
            // Extract the nested coordinates
            needsFix = true;
            newCoordinates = event.location.coordinates.coordinates;
          } else {
            needsFix = true;
            newCoordinates = [-73.9965, 40.7295];
          }
        }
        // Case 3: coordinates is missing or completely invalid
        else if (!event.location.coordinates) {
          needsFix = true;
          newCoordinates = [-73.9965, 40.7295];
        }

        if (needsFix) {
          console.log(`Fixing coordinates for: ${event.title}`);
          console.log(`Old coordinates: ${JSON.stringify(event.location.coordinates)}`);
          console.log(`New coordinates: ${JSON.stringify(newCoordinates)}`);
          
          // Update the event
          event.location.coordinates = newCoordinates;
          await event.save();
          fixedCount++;
          console.log('✓ Fixed successfully');
        } else {
          console.log('✓ Coordinates are valid, no fix needed');
          skippedCount++;
        }

      } catch (eventError) {
        console.error(`Error processing event "${event.title}":`, eventError.message);
      }
    }

    console.log(`\n=== Summary ===`);
    console.log(`Fixed ${fixedCount} events`);
    console.log(`Skipped ${skippedCount} events (already valid)`);
    console.log('All events should now have valid coordinates!');

    process.exit(0);

  } catch (error) {
    console.error('Error fixing events:', error);
    process.exit(1);
  }
};

fixEventCoordinates();