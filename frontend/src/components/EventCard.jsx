// components/EventCard.jsx (add save functionality)
import React, { useState } from 'react';
import { Box, Heading, Text, Badge, VStack, HStack, IconButton } from '@chakra-ui/react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const EventCard = ({ event }) => {
  const [isSaved, setIsSaved] = useState(false);

  const getCategoryColor = (category) => {
    const colors = {
      music: 'purple',
      academic: 'blue',
      food: 'orange',
      sports: 'green',
      arts: 'pink',
      social: 'teal',
      other: 'gray'
    };
    return colors[category] || 'gray';
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Connect to backend
  };

  return (
    <Box 
      p={4} 
      borderWidth="1px" 
      borderRadius="md" 
      boxShadow="sm"
      _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
      position="relative"
    >
      <IconButton
        icon={isSaved ? <FaHeart /> : <FaRegHeart />}
        position="absolute"
        top={2}
        right={2}
        aria-label="Save event"
        onClick={handleSave}
        color={isSaved ? 'red.500' : 'gray.500'}
        variant="ghost"
      />
      
      <VStack align="start" spacing={2}>
        <HStack justify="space-between" w="100%">
          <Heading as="h3" size="md">
            {event.title}
          </Heading>
          <Badge colorScheme={getCategoryColor(event.category)}>
            {event.category}
          </Badge>
        </HStack>
        
        <Text color="gray.600" noOfLines={2}>{event.description}</Text>
        
        <HStack spacing={4} fontSize="sm">
          <Text>📍 {event.location.name}</Text>
          <Text>🗓️ {new Date(event.date).toLocaleDateString()}</Text>
        </HStack>
        
        {event.price > 0 ? (
          <Text fontWeight="bold">${event.price}</Text>
        ) : (
          <Text fontWeight="bold" color="green.500">Free</Text>
        )}
      </VStack>
    </Box>
  );
};

export default EventCard;