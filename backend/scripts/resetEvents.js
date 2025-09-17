// scripts/resetEvents.js
const mongoose = require('mongoose');
const Event = require('../models/Event');
const connectDB = require('../config/database');

const resetEvents = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    // 1. Delete ALL existing events
    const deleteResult = await Event.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} events`);

    // 2. Create new, perfectly formatted events
    const newEvents = [
      {
        title: 'NYU Campus Music Festival',
        description: 'Live performances from student bands at Washington Square Park',
        category: 'music',
        date: new Date('2024-03-15T18:00:00.000Z'),
        location: {
          name: 'Washington Square Park',
          coordinates: [-73.9973, 40.7309], // [longitude, latitude]
          address: 'Washington Square North, New York, NY'
        },
        price: 0,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&w=600',
        source: 'NYU Events',
        sourceUrl: 'https://events.nyu.edu/'
      },
      {
        title: 'CS Department Career Fair',
        description: 'Tech companies recruiting NYU computer science students',
        category: 'academic',
        date: new Date('2024-03-20T13:00:00.000Z'),
        location: {
          name: 'NYU Tandon School',
          coordinates: [-73.9865, 40.6940],
          address: '6 MetroTech Center, Brooklyn, NY'
        },
        price: 0,
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&w=600',
        source: 'NYU Events',
        sourceUrl: 'https://events.nyu.edu/'
      },
      {
        title: 'International Food Fair',
        description: 'Global cuisine from NYU international student communities',
        category: 'food',
        date: new Date('2024-03-25T12:00:00.000Z'),
        location: {
          name: 'Kimmel Center',
          coordinates: [-73.9965, 40.7295],
          address: '60 Washington Square South, New York, NY'
        },
        price: 5,
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&w=600',
        source: 'NYU Events',
        sourceUrl: 'https://events.nyu.edu/'
      },
      {
        title: 'Basketball Tournament',
        description: 'Inter-college basketball championship games',
        category: 'sports',
        date: new Date('2024-04-01T14:00:00.000Z'),
        location: {
          name: 'NYU Athletic Center',
          coordinates: [-73.9950, 40.7315],
          address: '404 Lafayette St, New York, NY'
        },
        price: 10,
        imageUrl: 'https://images.unsplash.com/photo-1552667466-07770ae110d0?ixlib=rb-4.0.3&w=600',
        source: 'NYU Events',
        sourceUrl: 'https://events.nyu.edu/'
      },
      {
        title: 'Art Exhibition Opening',
        description: 'Showcase of student artwork from visual arts programs',
        category: 'arts',
        date: new Date('2024-04-05T17:00:00.000Z'),
        location: {
          name: 'NYU Steinhardt Gallery',
          coordinates: [-73.9930, 40.7285],
          address: '34 Stuyvesant St, New York, NY'
        },
        price: 0,
        imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&w=600',
        source: 'NYU Events',
        sourceUrl: 'https://events.nyu.edu/'
      }
    ];

    // 3. Insert the new events
    const result = await Event.insertMany(newEvents);
    console.log(`\n✅ Successfully created ${result.length} new events!`);
    
    console.log('\n📋 Event Summary:');
    result.forEach(event => {
      console.log(`📍 ${event.title} - ${event.location.name}`);
      console.log(`   Coordinates: [${event.location.coordinates}]`);
    });

    process.exit(0);

  } catch (error) {
    console.error('Error resetting events:', error);
    process.exit(1);
  }
};

resetEvents();