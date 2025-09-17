// pages/ListView.jsx
import React from 'react';
import { Box, Heading, VStack, Text, SimpleGrid } from '@chakra-ui/react';
import EventCard from '../components/EventCard';
import { useEvents } from '../hooks/useEvents';

const ListView = () => {
  const { events, loading, error } = useEvents();

  if (loading) {
    return (
      <Box p={4}>
        <Heading mb={4}>Loading events...</Heading>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <VStack spacing={6} align="stretch">
        <Heading>All Events ({events.length})</Heading>
        
        {error && (
          <Text color="red.500" bg="red.50" p={3} borderRadius="md">
            Error: {error}
          </Text>
        )}

        <SimpleGrid columns={[1, 2, 3]} spacing={4}>
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </SimpleGrid>

        {events.length === 0 && !error && (
          <Text textAlign="center" color="gray.500" py={10}>
            No events found. Check back later!
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default ListView; // <-- Make sure this export exists