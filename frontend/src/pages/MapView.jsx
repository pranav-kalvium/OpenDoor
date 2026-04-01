import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Flex,
  Skeleton,
  useToast,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import EventMap from '../components/EventMap';
import useEvents from '../hooks/useEvents';

const MapView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const { events, loading, error, applyFilters } = useEvents();
  const toast = useToast();

  const categories = [...new Set(events.map(event => event.category).filter(Boolean))];

  useEffect(() => {
    // Create new filters object without spreading existing filters to avoid infinite loop
    const newFilters = {
      search: searchQuery,
      category: selectedCategory,
      saved: showSavedOnly || undefined,
    };
    
    applyFilters(newFilters);
  }, [searchQuery, selectedCategory, showSavedOnly]); // Removed applyFilters and filters from dependencies

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  if (error) {
    toast({
      title: 'Error loading map',
      description: error,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading size="xl" mb={2}>
          Events Map
        </Heading>
        <Text color="gray.400">
          Discover events around Alliance University campus and Bangalore
        </Text>
      </Box>

      {/* Map Controls */}
      <Flex direction={{ base: 'column', md: 'row' }} gap={4} mb={6}>
        <InputGroup size="lg" flex="1">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search events on map..."
            value={searchQuery}
            onChange={handleSearch}
            bg="white"
            borderColor="gray.200"
            _hover={{ borderColor: 'gray.300' }}
          />
        </InputGroup>

        <Select
          placeholder="All categories"
          value={selectedCategory}
          onChange={handleCategoryChange}
          bg="white"
          borderColor="gray.200"
          width={{ base: '100%', md: '200px' }}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>

        <FormControl display="flex" alignItems="center" width="auto">
          <FormLabel htmlFor="saved-events" mb="0" color="gray.400">
            Saved only
          </FormLabel>
          <Switch
            id="saved-events"
            isChecked={showSavedOnly}
            onChange={(e) => setShowSavedOnly(e.target.checked)}
            colorScheme="brand"
          />
        </FormControl>
      </Flex>

      {/* Map Container */}
      <Box
        borderRadius="lg"
        overflow="hidden"
        boxShadow="xl"
        position="relative"
      >
        {loading ? (
          <Skeleton height="500px" />
        ) : (
          <EventMap events={events} isLoading={loading} />
        )}
        
        {/* Map Overlay Info */}
        <Box
          position="absolute"
          top={4}
          left={4}
          bg="white"
          color="gray.800"
          boxShadow="md"
          px={3}
          py={2}
          borderRadius="md"
          zIndex={1000}
        >
          <Text fontSize="sm" fontWeight="bold">
            {events.length} event{events.length !== 1 ? 's' : ''} found
          </Text>
        </Box>
      </Box>

      {/* Legend */}
      <Flex mt={4} gap={4} flexWrap="wrap" justify="center">
        <Flex align="center" gap={2}>
          <Box w={3} h={3} bg="yellow.500" borderRadius="full" />
          <Text fontSize="sm" color="gray.600">Academic Events</Text>
        </Flex>
        <Flex align="center" gap={2}>
          <Box w={3} h={3} bg="green.500" borderRadius="full" />
          <Text fontSize="sm" color="gray.600">Social Events</Text>
        </Flex>
        <Flex align="center" gap={2}>
          <Box w={3} h={3} bg="orange.500" borderRadius="full" />
          <Text fontSize="sm" color="gray.600">Cultural Events</Text>
        </Flex>
        <Flex align="center" gap={2}>
          <Box w={3} h={3} bg="teal.500" borderRadius="full" />
          <Text fontSize="sm" color="gray.600">Sports Events</Text>
        </Flex>
      </Flex>
    </Container>
  );
};

export default MapView;