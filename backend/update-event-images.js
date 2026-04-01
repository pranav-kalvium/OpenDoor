const mongoose = require('mongoose');
require('dotenv').config();

const imageMap = {
  'Tech Symposium 2024':       '/uploads/tech_symposium.png',
  'Cricket Tournament':        '/uploads/cricket_tournament.png',
  'Startup Networking Night':  '/uploads/startup_networking.png',
  'Cultural Fest - Harmony':   '/uploads/cultural_fest.png',
  'Career Fair 2024':          '/uploads/career_fair.png',
};

async function updateImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const Event = require('./models/Event');
    const events = await Event.find({});
    console.log(`Found ${events.length} events`);

    for (const event of events) {
      const imagePath = imageMap[event.title];
      if (imagePath) {
        event.image = imagePath;
        await event.save();
        console.log(`✅ Updated image for: "${event.title}" → ${imagePath}`);
      } else {
        console.log(`⚠️  No image mapping for: "${event.title}"`);
      }
    }

    console.log('\nDone! All event images updated.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

updateImages();
