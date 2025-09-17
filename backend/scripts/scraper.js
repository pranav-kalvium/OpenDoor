// scripts/scraper.js
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const connectDB = require('../config/database');

const TARGET_URL = 'https://events.nyu.edu/';

const scrapeEvents = async () => {
  try {
    // 1. CONNECT TO DATABASE
    await connectDB();
    console.log(`Fetching data from: ${TARGET_URL}...`);
    
    // 2. FETCH HTML
    const { data } = await axios.get(TARGET_URL, {
      timeout: 10000 // 10 second timeout
    });
    const $ = cheerio.load(data);

    console.log('Page title:', $('title').text());
    
    // 3. FIRST, LET'S TRY TO FIND EVENTS USING DIFFERENT SELECTORS
    console.log('\n=== SEARCHING FOR EVENTS ===');
    
    // Common event selectors we can try
    const possibleSelectors = [
      '.event',
      '.tribe-events-list-event-title', // Common in calendar systems
      '.views-row', // Drupal-based sites
      '[data-type="event"]',
      '.calendar-event',
      '.event-list-item'
    ];

    let foundAnyEvents = false;

    for (const selector of possibleSelectors) {
      const elements = $(selector);
      if (elements.length > 0) {
        console.log(`\n🎉 FOUND ${elements.length} elements with selector: "${selector}"`);
        foundAnyEvents = true;
        
        // Show samples of what we found
        elements.slice(0, 2).each((index, element) => {
          console.log(`\nSample ${index + 1}:`);
          console.log('Text:', $(element).text().trim().substring(0, 100) + '...');
          console.log('HTML snippet:', $(element).html()?.substring(0, 200) + '...');
        });
        break;
      }
    }

    if (!foundAnyEvents) {
      console.log('\n🔍 No standard event selectors found. Let me search for event-like content...');
      
      // Look for elements that might contain event information
      $('div, article, li').each((index, element) => {
        if (index > 50) return false; // Only check first 50 elements
        
        const text = $(element).text().trim();
        const classes = $(element).attr('class') || '';
        const hasDate = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/i.test(text);
        const hasTime = /\b(1[0-2]|0?[1-9]):[0-5][0-9]\s*(AM|PM)|([01]?[0-9]|2[0-3]):[0-5][0-9]/.test(text);
        
        if (text.length > 50 && (hasDate || hasTime || classes.includes('event') || classes.includes('calendar'))) {
          console.log(`\n📅 Potential event container found:`);
          console.log('Classes:', classes);
          console.log('Text sample:', text.substring(0, 150) + '...');
          console.log('Has date:', hasDate, 'Has time:', hasTime);
          return false; // Stop after first find
        }
      });
    }

    // 4. ADD SAMPLE EVENTS FOR TESTING (since real scraping needs more work)
    console.log('\n=== ADDING SAMPLE EVENTS FOR DEVELOPMENT ===');
    
    const sampleEvents = [
      {
        title: 'NYU Annual Music Festival',
        description: 'Join us for a day of live music performances from NYU student bands and special guests. Food trucks and beverages will be available.',
        category: 'music',
        date: new Date('2024-03-15T18:00:00.000Z'),
        location: {
          name: 'Washington Square Park',
          coordinates: [-73.9973, 40.7309],
          address: 'Washington Square North, New York, NY 10012'
        },
        price: 0,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        source: 'NYU Events',
        sourceUrl: TARGET_URL
      },
      {
        title: 'Computer Science Career Fair',
        description: 'Meet top tech companies recruiting NYU CS students. Bring your resume and portfolio. Business casual attire recommended.',
        category: 'academic',
        date: new Date('2024-03-20T13:00:00.000Z'),
        location: {
          name: 'NYU Tandon MakerSpace',
          coordinates: [-73.9865, 40.6940],
          address: '6 MetroTech Center, Brooklyn, NY 11201'
        },
        price: 0,
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        source: 'NYU Events',
        sourceUrl: TARGET_URL
      },
      {
        title: 'International Food Festival',
        description: 'Sample cuisine from around the world prepared by NYU international students. Celebrate cultural diversity through food!',
        category: 'food',
        date: new Date('2024-03-25T12:00:00.000Z'),
        location: {
          name: 'Kimmel Center Plaza',
          coordinates: [-73.9965, 40.7295],
          address: '60 Washington Square S, New York, NY 10012'
        },
        price: 5,
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        source: 'NYU Events',
        sourceUrl: TARGET_URL
      }
    ];

    // 5. CLEAR EXISTING EVENTS FIRST (optional, for clean testing)
    await Event.deleteMany({ source: 'NYU Events' });
    console.log('Cleared existing sample events...');

    // 6. INSERT SAMPLE EVENTS
    const result = await Event.insertMany(sampleEvents);
    console.log(`\n✅ Successfully added ${result.length} sample events!`);
    
    result.forEach(event => {
      console.log(`   - ${event.title} (${event.date.toLocaleDateString()})`);
    });

    console.log('\n💡 Tip: Use Thunder Client to test your API:');
    console.log('   GET http://localhost:5000/api/events');
    console.log('   You should see these 3 sample events!');

  } catch (err) {
    console.error('❌ Error:', err.message);
    if (err.code === 'ECONNABORTED') {
      console.log('The request took too long. Try again or check your internet connection.');
    }
  } finally {
    // 7. Close connection safely
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('\nDatabase connection closed.');
    }
  }
};

// Run the scraper
scrapeEvents();