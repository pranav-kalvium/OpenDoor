// models/Event.js
const mongoose = require('mongoose');

// Define the rules (schema) for what an Event document looks like
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'An event must have a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'An event must have a description']
  },
  category: {
    type: String,
    required: true,
    enum: { // The 'enum' validator means the value must be in this list
      values: ['music', 'food', 'academic', 'sports', 'arts', 'social', 'other'],
      message: 'Category is either: music, food, academic, sports, arts, social, other'
    }
  },
  date: {
    type: Date, // This field will store a full date and time
    required: [true, 'An event must have a date']
  },
  // This is a nested object to store location data
  location: {
    name: {
      type: String,
      required: [true, 'An event must have a venue name']
    },
    // GeoJSON is a standard format for storing geographic coordinates.
    // This is crucial for putting pins on a map later.
    coordinates: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'] // 'location.type' must be 'Point'
      },
      coordinates: {
        type: [Number], // An array of numbers: [longitude, latitude]
        required: true
      }
    },
    address: String
  },
  price: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' // A default event image
  },
  // We'll use this later for our web scraper to know where the event came from.
  source: {
    type: String,
    default: 'OpenDoor'
  },
  sourceUrl: String // A link back to the original event page
}, {
  timestamps: true // Adds 'createdAt' and 'updatedAt'
});

// Create the Model from the Schema and export it
const Event = mongoose.model('Event', eventSchema);
module.exports = Event;