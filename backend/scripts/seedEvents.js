const mongoose = require('mongoose');
const Event = require('../models/Event');
const User = require('../models/User');
require('dotenv').config();

const seedEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/opendoor');

    // Find a user to associate with events
    const user = await User.findOne();
    if (!user) {
      console.log('No users found. Please create a user first.');
      return;
    }

    const defaultEvents = [
      {
        title: 'Tech Symposium 2024',
        description: 'Annual technology conference featuring industry experts and workshops on emerging technologies.',
        date: new Date('2024-03-15T10:00:00'),
        location: {
          address: 'Alliance University Tech Park, Bangalore',
          coordinates: [77.5946, 12.9716]
        },
        category: 'academic',
        price: 'Free',
        createdBy: user._id
      },
      {
        title: 'Cultural Fest - Harmony',
        description: 'Annual cultural festival showcasing diverse performances, food stalls, and art exhibitions.',
        date: new Date('2024-04-20T14:00:00'),
        location: {
          address: 'University Main Ground, Alliance University',
          coordinates: [77.5946, 12.9716]
        },
        category: 'cultural',
        price: '₹200',
        createdBy: user._id
      },
      {
        title: 'Career Fair 2024',
        description: 'Connect with top recruiters and explore internship and job opportunities.',
        date: new Date('2024-05-10T09:30:00'),
        location: {
          address: 'Placement Cell, Alliance University',
          coordinates: [77.5946, 12.9716]
        },
        category: 'career',
        price: 'Free',
        createdBy: user._id
      },
      {
        title: 'Cricket Tournament',
        description: 'Inter-department cricket tournament with exciting prizes and trophies.',
        date: new Date('2024-03-25T15:00:00'),
        location: {
          address: 'University Sports Ground, Alliance University',
          coordinates: [77.5946, 12.9716]
        },
        category: 'sports',
        price: 'Free',
        createdBy: user._id
      },
      {
        title: 'Startup Networking Night',
        description: 'Networking event for aspiring entrepreneurs and startup enthusiasts.',
        date: new Date('2024-04-05T18:00:00'),
        location: {
          address: 'Innovation Hub, Alliance University',
          coordinates: [77.5946, 12.9716]
        },
        category: 'social',
        price: '₹100',
        createdBy: user._id
      }
    ];

    await Event.deleteMany({});
    await Event.insertMany(defaultEvents);

    console.log('Default events seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
};

seedEvents();