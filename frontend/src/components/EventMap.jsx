// components/EventMap.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Text, Heading, Spinner, Alert, AlertIcon } from '@chakra-ui/react';

const EventMap = ({ events, loading }) => {
  // Default center (NYU coordinates)
  const defaultCenter = [40.7295, -73.9965];
  
  // Filter and extract coordinates from GeoJSON format
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

  if (loading) {
    return (
      <Box height="500px" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (validEvents.length === 0 && !loading) {
    return (
      <Box height="500px" display="flex" alignItems="center" justifyContent="center">
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          No events with valid location data found.
        </Alert>
      </Box>
    );
  }

  return (
    <Box height="500px" borderRadius="md" overflow="hidden" boxShadow="md">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {validEvents.map((event) => (
          <Marker
            key={event._id}
            position={[
              event.location.coordinates.coordinates[1], // latitude
              event.location.coordinates.coordinates[0]  // longitude
            ]}
          >
            <Popup>
              <Box p={2}>
                <Heading as="h3" size="sm" mb={2}>
                  {event.title}
                </Heading>
                <Text fontSize="sm" mb={1}>
                  📍 {event.location.name}
                </Text>
                <Text fontSize="sm" mb={1}>
                  🗓️ {new Date(event.date).toLocaleDateString()}
                </Text>
                <Text fontSize="sm">
                  ⏰ {new Date(event.date).toLocaleTimeString()}
                </Text>
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default EventMap;