// pages/MapView.jsx (add this debug section)
import React from 'react';
import { Box, Heading, VStack, Text, Alert, AlertIcon, Code, Button } from '@chakra-ui/react';
import EventMap from '../components/EventMap';
import { useEvents } from '../hooks/useEvents';

const MapView = () => {
  const { events, loading, error, refetch } = useEvents();

  // pages/MapView.jsx (update the filter logic)
const validEvents = events.filter(event => 
  event.location && 
  event.location.coordinates && 
  event.location.coordinates.coordinates && // GeoJSON has nested coordinates
  event.location.coordinates.coordinates.length === 2 &&
  typeof event.location.coordinates.coordinates[0] === 'number' &&
  typeof event.location.coordinates.coordinates[1] === 'number' &&
  !isNaN(event.location.coordinates.coordinates[0]) &&
  !isNaN(event.location.coordinates.coordinates[1])
);

  // Filter logic to see what's happening with the data

  const invalidEvents = events.length - validEvents.length;

  // Debug: Log the actual data we're receiving
  React.useEffect(() => {
    if (events.length > 0) {
      console.log('=== DEBUG: Events from API ===');
      events.forEach((event, index) => {
        console.log(`Event ${index + 1}:`, {
          title: event.title,
          coordinates: event.location?.coordinates,
          coordinatesType: typeof event.location?.coordinates,
          isArray: Array.isArray(event.location?.coordinates),
          isValid: event.location?.coordinates?.length === 2 && 
                  typeof event.location?.coordinates[0] === 'number' &&
                  typeof event.location?.coordinates[1] === 'number'
        });
      });
    }
  }, [events]);

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Heading>Event Map</Heading>
        
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            Error: {error}
          </Alert>
        )}

        {invalidEvents > 0 && (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            {invalidEvents} event(s) filtered out due to missing location data.
          </Alert>
        )}

        // pages/MapView.jsx (clean up the debug info)
      {invalidEvents > 0 && (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          {invalidEvents} event(s) hidden due to incomplete location data.
        </Alert>
      )}

      {validEvents.length > 0 && (
        <Box bg="blue.50" p={3} borderRadius="md">
          <Text fontWeight="bold">🗺️ {validEvents.length} events mapped</Text>
          <Text fontSize="sm">Click on markers for event details</Text>
        </Box>
      )}
          
        

        <EventMap events={events} loading={loading} />
        
        <Box>
          <Heading size="md" mb={2}>
            Events Found: {validEvents.length} of {events.length}
          </Heading>
          <Text color="gray.600">
            Click on the map markers to see event details
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default MapView;