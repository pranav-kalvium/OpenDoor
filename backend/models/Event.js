const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    minlength: [10, 'Description must be at least 10 characters long']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  location: {
    type: mongoose.Schema.Types.Mixed, 
    required: [true, 'Location is required']
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: ['academic', 'social', 'cultural', 'sports', 'career', 'other']
  },
  image: {
    type: String,
    default: null
  },
  website: {
    type: String,
    default: null
  },
  price: {
    type: String,
    default: 'Free'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Virtual for getting location string
eventSchema.virtual('locationString').get(function() {
  if (typeof this.location === 'string') {
    return this.location;
  }
  if (this.location && this.location.address) {
    return this.location.address;
  }
  return 'Location not specified';
});

// Ensure virtuals are included in JSON output
eventSchema.set('toJSON', { virtuals: true });

// Index for better search performance
eventSchema.index({ title: 'text', description: 'text', category: 'text' });
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });

module.exports = mongoose.model('Event', eventSchema);
