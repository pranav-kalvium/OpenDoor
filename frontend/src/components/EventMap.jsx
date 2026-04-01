import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import { Box, Text, Spinner, Center, Badge, Heading } from '@chakra-ui/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ─── Alliance University Campus, Anekal, Bengaluru ───
// Chikkahagade Cross, Chandapura - Anekal Main Road, 562106
const ALLIANCE_CENTER = [12.7297, 77.7083];
const DEFAULT_ZOOM = 17;

// Named campus landmarks – events without coordinates
// are distributed across these spots around the campus
const CAMPUS_LOCATIONS = [
  { name: 'Main Auditorium',          coords: [12.7300, 77.7080] },
  { name: 'Central Library',          coords: [12.7293, 77.7075] },
  { name: 'Student Activity Center',  coords: [12.7305, 77.7090] },
  { name: 'Sports Complex',           coords: [12.7288, 77.7088] },
  { name: 'Seminar Hall Block',       coords: [12.7302, 77.7070] },
  { name: 'Open Air Theatre',         coords: [12.7290, 77.7095] },
  { name: 'Engineering Block',        coords: [12.7308, 77.7078] },
  { name: 'Business School',          coords: [12.7295, 77.7068] },
  { name: 'Cafeteria',                coords: [12.7285, 77.7080] },
  { name: 'Innovation Hub',           coords: [12.7310, 77.7085] },
];

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom coloured marker icons
const createCustomIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const campusIcon = createCustomIcon('green');

const iconMap = {
  academic: createCustomIcon('gold'),
  social:   createCustomIcon('red'),
  cultural: createCustomIcon('orange'),
  sports:   createCustomIcon('yellow'),
  career:   createCustomIcon('green'),
  default:  createCustomIcon('grey'),
};

// ─── helpers ───

/** Check if coords are the old wrong default (central Bangalore) */
const isGenericBangalore = (coords) => {
  if (!coords || coords.length < 2) return true;
  const [lng, lat] = coords;
  // The old fallback was [77.5946, 12.9716]
  return (Math.abs(lat - 12.9716) < 0.01 && Math.abs(lng - 77.5946) < 0.01);
};

/** Get display-ready [lat, lng] for an event.
 *  If the event has no real campus coordinates we assign
 *  it to one of the named campus landmarks (round-robin by index). */
const resolveCoordinates = (event, index) => {
  // Has real coordinates that are NOT the old wrong default?
  if (
    event.location?.coordinates &&
    Array.isArray(event.location.coordinates) &&
    !isGenericBangalore(event.location.coordinates)
  ) {
    return [event.location.coordinates[1], event.location.coordinates[0]];
  }

  // Try matching the location string to a known campus landmark
  if (typeof event.location === 'string' || event.location?.address) {
    const locStr = (typeof event.location === 'string'
      ? event.location
      : event.location.address
    ).toLowerCase();

    const match = CAMPUS_LOCATIONS.find(l => locStr.includes(l.name.toLowerCase()));
    if (match) return match.coords;
  }

  // Fallback: distribute across campus landmarks by index
  const spot = CAMPUS_LOCATIONS[index % CAMPUS_LOCATIONS.length];
  return spot.coords;
};

const getLocationLabel = (event) => {
  if (typeof event.location === 'string') return event.location;
  if (event.location?.address) return event.location.address;
  return 'Alliance University Campus';
};

// ─── sub-components ───

const MapUpdater = ({ events }) => {
  const map = useMap();

  useEffect(() => {
    // Always keep campus in view, but pad bounds to include event pins
    if (events.length > 0) {
      const markers = events.map((event, i) => L.marker(resolveCoordinates(event, i)));
      // Also include the campus centre
      markers.push(L.marker(ALLIANCE_CENTER));
      const group = new L.FeatureGroup(markers);

      if (group.getBounds().isValid()) {
        map.fitBounds(group.getBounds().pad(0.15), { maxZoom: 18 });
      } else {
        map.setView(ALLIANCE_CENTER, DEFAULT_ZOOM);
      }
    } else {
      map.setView(ALLIANCE_CENTER, DEFAULT_ZOOM);
    }
  }, [events, map]);

  return null;
};

// ─── main component ───

const EventMap = ({ events, isLoading }) => {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => { setMapReady(true); }, []);

  const getEventIcon = (event) => iconMap[event.category] || iconMap.default;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Center h="500px">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  return (
    <Box height="500px" width="100%" borderRadius="lg" overflow="hidden" className="glass-card">
      {mapReady && (
        <MapContainer
          center={ALLIANCE_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* ── Alliance University campus pin ── */}
          <Marker position={ALLIANCE_CENTER} icon={campusIcon}>
            <Popup>
              <Box p={2} minWidth="220px">
                <Text fontWeight="bold" fontSize="md" mb={1}>🏛️ Alliance University</Text>
                <Text fontSize="sm" color="gray.600">
                  Chikkahagade Cross, Chandapura&nbsp;- Anekal Main Road,
                  Anekal, Bengaluru&nbsp;562106
                </Text>
              </Box>
            </Popup>
          </Marker>

          {/* Campus boundary circle */}
          <Circle
            center={ALLIANCE_CENTER}
            radius={350}
            pathOptions={{
              color: '#805AD5',
              fillColor: '#805AD5',
              fillOpacity: 0.06,
              weight: 1.5,
              dashArray: '6',
            }}
          />

          <MapUpdater events={events} />

          {/* ── Event markers ── */}
          {events.map((event, index) => (
            <Marker
              key={event._id || index}
              position={resolveCoordinates(event, index)}
              icon={getEventIcon(event)}
            >
              <Popup>
                <Box p={2} minWidth="250px">
                  <Text fontWeight="bold" fontSize="lg" mb={2}>{event.title}</Text>
                  <Badge colorScheme={getBadgeColor(event.category)} mb={2}>
                    {event.category}
                  </Badge>
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    {formatDate(event.date || event.start_time)}
                  </Text>
                  <Text fontSize="sm" mb={2}>
                    📍 {getLocationLabel(event)}
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
    career: 'green',
  };
  return colorMap[category] || 'gray';
};

export default EventMap;