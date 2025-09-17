// scripts/testValidation.js
// Test the exact same validation logic used in your frontend
const testEvents = [
  {
    location: {
      coordinates: [-73.9973, 40.7309] // This should work
    }
  },
  {
    location: {
      coordinates: "[-73.9973, 40.7309]" // String instead of array
    }
  },
  {
    location: {
      coordinates: [] // Empty array
    }
  },
  {
    location: {
      coordinates: [40.7309] // Only one coordinate
    }
  },
  {
    location: {
      coordinates: ['-73.9973', '40.7309'] // String coordinates
    }
  }
];

testEvents.forEach((event, index) => {
  const isValid = event.location && 
                 event.location.coordinates && 
                 event.location.coordinates.length === 2 &&
                 typeof event.location.coordinates[0] === 'number' &&
                 typeof event.location.coordinates[1] === 'number' &&
                 !isNaN(event.location.coordinates[0]) &&
                 !isNaN(event.location.coordinates[1]);
  
  console.log(`Event ${index + 1}:`, {
    coordinates: event.location.coordinates,
    isValid: isValid,
    type0: typeof event.location.coordinates[0],
    type1: typeof event.location.coordinates[1]
  });
});