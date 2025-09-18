import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Skeleton,
  Flex,
  Button,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { FaFilter, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'; // Changed from FilterIcon to FaFilter
import EventCard from '../components/EventCard';
import useEvents from '../hooks/useEvents';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { events, loading, error, filters, setFilters } = useEvents();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const categories = useMemo(() => {
    const uniqueCategories = new Set();
    events.forEach(event => {
      if (event.category) {
        uniqueCategories.add(event.category);
      }
    });
    return Array.from(uniqueCategories);
  }, [events]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setFilters(prev => ({ ...prev, category: category || undefined }));
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setFilters(prev => ({ ...prev, date: date || undefined }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedDate('');
    setFilters({});
  };

  const handleEventUpdate = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Please login',
        description: 'You need to be logged in to save events',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box textAlign="center" py={10}>
          <Heading size="lg" mb={4}>Error Loading Events</Heading>
          <Text color="gray.400">{error}</Text>
          <Button mt={4} colorScheme="blue" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      {/* Hero Section */}
      <Box textAlign="center" mb={12}>
        <Heading 
          size="2xl" 
          mb={4} 
          bgGradient="linear(to-r, blue.400, purple.500)"
          bgClip="text"
        >
          Discover Amazing Events
        </Heading>
        <Text fontSize="xl" color="gray.400" maxW="2xl" mx="auto">
          Find and attend the best events around NYU. From academic conferences to social gatherings, we've got you covered.
        </Text>
      </Box>

      {/* Search and Filters */}
      <Box mb={8}>
        <Flex direction={{ base: 'column', md: 'row' }} gap={4} mb={6}>
          <InputGroup size="lg" flex="1">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={handleSearch}
              bg="whiteAlpha.100"
              borderColor="whiteAlpha.200"
              _hover={{ borderColor: 'whiteAlpha.300' }}
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
            />
          </InputGroup>

          <Button
            leftIcon={<FaFilter />}
            onClick={onOpen}
            size="lg"
            variant="outline"
            borderColor="whiteAlpha.200"
            _hover={{ bg: 'whiteAlpha.100' }}  // Fixed: added underscore
          >
            Filters
          </Button>
        </Flex>

        {/* Active filters display */}
        {(filters.category || filters.date || filters.search) && (
          <HStack mb={4} spacing={3} flexWrap="wrap">
            <Text fontSize="sm" color="gray.400">Active filters:</Text>
            {filters.search && (
              <Button size="sm" variant="outline" colorScheme="blue">
                Search: {filters.search}
              </Button>
            )}
            {filters.category && (
              <Button size="sm" variant="outline" colorScheme="green">
                Category: {filters.category}
              </Button>
            )}
            {filters.date && (
              <Button size="sm" variant="outline" colorScheme="purple">
                Date: {new Date(filters.date).toLocaleDateString()}
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={clearFilters}>
              Clear all
            </Button>
          </HStack>
        )}
      </Box>

      {/* Events Grid */}
      {loading ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} height="400px" borderRadius="lg" />
          ))}
        </SimpleGrid>
      ) : events.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {events.map((event, index) => (
            <EventCard 
              key={event._id || index} 
              event={event} 
              onEventUpdate={handleEventUpdate}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Box textAlign="center" py={20}>
          <Heading size="lg" mb={4} color="gray.400">
            No events found
          </Heading>
          <Text color="gray.500">
            {filters.search || filters.category || filters.date 
              ? 'Try adjusting your filters to see more results.' 
              : 'Check back later for new events!'
            }
          </Text>
          {(filters.search || filters.category || filters.date) && (
            <Button mt={4} onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </Box>
      )}

      {/* Filters Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="gray.800">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Filter Events</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" py={4}>
              <Box>
                <Text mb={2} fontWeight="medium">Category</Text>
                <Select
                  placeholder="All categories"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  bg="whiteAlpha.100"
                  borderColor="whiteAlpha.200"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </Box>

              <Box>
                <Text mb={2} fontWeight="medium">Date</Text>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  bg="whiteAlpha.100"
                  borderColor="whiteAlpha.200"
                />
              </Box>

              <Button onClick={clearFilters} variant="outline" mt={4}>
                Clear Filters
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Container>
  );
};

export default Home;