import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Box, Text, Spinner, Center, Badge } from '@chakra-ui/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different event types
const createCustomIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconMap = {
  academic: createCustomIcon('blue'),
  social: createCustomIcon('red'),
  cultural: createCustomIcon('violet'),
  sports: createCustomIcon('orange'),
  career: createCustomIcon('green'),
  default: createCustomIcon('gold')
};

const MapUpdater = ({ events }) => {
  const map = useMap();
  
  useEffect(() => {
    if (events.length > 0) {
      const group = new L.FeatureGroup(events.map(event => 
        L.marker([event.location?.coordinates?.[1] || 12.9716, event.location?.coordinates?.[0] || 77.5946])
      ));
      
      if (group.getBounds().isValid()) {
        map.fitBounds(group.getBounds().pad(0.1));
      } else {
        // Default to Alliance University Bangalore coordinates
        map.setView([12.9716, 77.5946], 13);
      }
    }
  }, [events, map]);

  return null;
};

const EventMap = ({ events, isLoading }) => {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  const getEventCoordinates = (event) => {
    if (event.location?.coordinates) {
      return [event.location.coordinates[1], event.location.coordinates[0]];
    }
    // Default to Bangalore coordinates
    return [12.9716, 77.5946];
  };

  const getEventIcon = (event) => {
    return iconMap[event.category] || iconMap.default;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Center h="500px">
        <Spinner size="xl" color="blue.400" />
      </Center>
    );
  }

  return (
    <Box height="500px" width="100%" borderRadius="lg" overflow="hidden" className="glass-card">
      {mapReady && (
        <MapContainer
          center={[12.9716, 77.5946]} // Bangalore coordinates
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapUpdater events={events} />
          
          {events.map((event, index) => (
            <Marker
              key={event._id || index}
              position={getEventCoordinates(event)}
              icon={getEventIcon(event)}
            >
              <Popup>
                <Box p={2} minWidth="250px">
                  <Text fontWeight="bold" fontSize="lg" mb={2}>{event.title}</Text>
                  <Badge colorScheme={getBadgeColor(event.category)} mb={2}>
                    {event.category}
                  </Badge>
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    {formatDate(event.date)}
                  </Text>
                  <Text fontSize="sm" mb={2}>
                    {typeof event.location === 'object' ? event.location.address : event.location}
                  </Text>
                  <Text fontSize="sm" noOfLines={3}>
                    {event.description}
                  </Text>
                </Box>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </Box>
  );
};

const getBadgeColor = (category) => {
  const colorMap = {
    academic: 'blue',
    social: 'red',
    cultural: 'purple',
    sports: 'orange',
    career: 'green'
  };
  return colorMap[category] || 'gray';
};

export default EventMap;