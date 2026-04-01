import React, { useState, useMemo, useEffect, useRef } from 'react';
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
import { FiFilter, FiCalendar, FiMusic, FiCamera, FiCoffee, FiStar, FiMap, FiVideo } from 'react-icons/fi';
import EventCard from '../components/EventCard';
import useEvents from '../hooks/useEvents';
import { useAuth } from '../context/AuthContext';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';

// Wrap Chakra components with motion for animation
const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { events, loading, error, filters, setFilters, pagination, changePage } = useEvents();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  // Mouse Parallax Logic using Framer Motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax transform rates for different depth layers
  const x1 = useTransform(mouseX, [-0.5, 0.5], [30, -30]);
  const y1 = useTransform(mouseY, [-0.5, 0.5], [30, -30]);
  
  const x2 = useTransform(mouseX, [-0.5, 0.5], [50, -50]);
  const y2 = useTransform(mouseY, [-0.5, 0.5], [50, -50]);
  
  const x3 = useTransform(mouseX, [-0.5, 0.5], [70, -70]);
  const y3 = useTransform(mouseY, [-0.5, 0.5], [70, -70]);

  const handleMouseMove = (e) => {
    // Normalize mouse coordinates from -0.5 to 0.5
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX / innerWidth - 0.5);
    mouseY.set(clientY / innerHeight - 0.5);
  };

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

  // Add this useEffect to update filters to fetch 25 events
  React.useEffect(() => {
    setFilters(prev => ({
      ...prev,
      limit: 25, // Increase number of events fetched to 25
    }));
  }, [setFilters]);
  
  // Animation Variants for Container Stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger items by 0.2s
        delayChildren: 0.3    // Initial delay
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <Box>
      {/* Dynamic Animated Hero Section */}
      <Box 
        onMouseMove={handleMouseMove}
        position="relative" 
        pt={{ base: 20, md: 32 }} 
        pb={{ base: 16, md: 24 }} 
        overflow="hidden"
      >
        {/* Subtle Floating Icons Background instead of blobs */}
        <MotionBox 
          style={{ x: x1, y: y1 }}
          animate={{ y: ["-10px", "10px", "-10px"], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          position="absolute" top="10%" left="15%" opacity={0.15} zIndex={0} 
        >
          <FiCalendar size={80} color="#10b981" />
        </MotionBox>
        <MotionBox 
          style={{ x: x2, y: y2 }}
          animate={{ y: ["15px", "-15px", "15px"], rotate: [0, -10, 5, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          position="absolute" top="20%" right="15%" opacity={0.1} zIndex={0} 
        >
          <FiMusic size={100} color="#059669" />
        </MotionBox>
        <MotionBox 
          style={{ x: x3, y: y3 }}
          animate={{ y: ["-15px", "15px", "-15px"], rotate: [0, 15, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          position="absolute" bottom="15%" left="20%" opacity={0.12} zIndex={0} 
        >
          <FiCamera size={60} color="#10b981" />
        </MotionBox>
        <MotionBox 
          style={{ x: x1, y: y3 }}
          animate={{ y: ["10px", "-10px", "10px"], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          position="absolute" bottom="25%" right="20%" opacity={0.15} zIndex={0} 
        >
          <FiStar size={70} color="#FBBF24" />
        </MotionBox>
        <MotionBox 
          style={{ x: x2, y: y1 }}
          animate={{ y: ["-8px", "8px", "-8px"], rotate: [10, -10, 10] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          position="absolute" top="40%" left="5%" opacity={0.08} zIndex={0} 
        >
          <FiCoffee size={50} color="#059669" />
        </MotionBox>

        <Container maxW="container.xl" position="relative" zIndex={1}>
          {/* Apply staggered animation to this container */}
          <MotionBox 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Box textAlign="center" mb={12}>
              <MotionHeading 
                variants={itemVariants}
                as="h1"
                color="gray.900" 
                fontWeight="900" 
                lineHeight="1.1"
                mb={6} 
                letterSpacing="tight"
              >
                Discover <Text as="span" bgGradient="linear(to-r, brand.500, brand.300)" bgClip="text">Amazing</Text><br />
                Events at Alliance
              </MotionHeading>
              <MotionText 
                variants={itemVariants}
                fontSize={{ base: 'lg', md: 'xl' }} 
                color="gray.600" 
                maxW="2xl" 
                mx="auto" 
                fontWeight="500"
              >
                Find and attend the best events happening around campus. From academic conferences to social gatherings, we've got you covered.
              </MotionText>
            </Box>

            {/* Glassmorphic Search and Filters */}
            <MotionBox variants={itemVariants} className="glass-card" p={{ base: 4, md: 6 }} mx="auto" maxW="4xl" mb={12}>
            <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
              <InputGroup size="lg" flex="1">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="brand.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search events, organizers, venues..."
                  value={searchQuery}
                  onChange={handleSearch}
                  variant="outline"
                  bg="white"
                  color="gray.800"
                  _focus={{ bg: 'white', borderColor: 'brand.500' }}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="xl"
                />
              </InputGroup>
              
              <Button
                leftIcon={<FiFilter />}
                onClick={onOpen}
                size="lg"
                variant="solid"
                colorScheme="brand"
                boxShadow="0 4px 15px rgba(14, 165, 233, 0.3)"
              >
                Filters
              </Button>
            </Flex>

            {/* Active filters display */}
            {(filters.category || filters.date || filters.search) && (
              <HStack mt={4} spacing={3} flexWrap="wrap">
                <Text fontSize="sm" color="gray.600">Active filters:</Text>
                {filters.search && (
                  <Button size="sm" variant="outline" borderColor="brand.500" color="brand.500">
                    Search: {filters.search}
                  </Button>
                )}
                {filters.category && (
                  <Button size="sm" variant="outline" borderColor="brand.600" color="brand.600">
                    Category: {filters.category}
                  </Button>
                )}
                {filters.date && (
                  <Button size="sm" variant="outline" borderColor="brand.400" color="brand.400">
                    Date: {new Date(filters.date).toLocaleDateString()}
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={clearFilters} color="gray.500" _hover={{ color: "gray.800" }}>
                  Clear all
                </Button>
              </HStack>
            )}
            </MotionBox>
          </MotionBox>
        </Container>
      </Box>

      {/* Events Grid */}
      <Container maxW="container.xl" py={8} position="relative" zIndex={1}>
      {loading ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} height="384px" borderRadius="lg" />
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
          <Heading size="lg" mb={4} color="gray.600">No events found</Heading>
          <Text color="gray.500">
            {filters.search || filters.category || filters.date
              ? 'Try adjusting your filters to see more results.'
              : 'Check back later for new events!'}
          </Text>
          {(filters.search || filters.category || filters.date) && (
            <Button
              onClick={clearFilters}
              colorScheme="blue"
              mt={4}
            >
              Clear Filters
            </Button>
          )}
        </Box>
      )}

      {/* Pagination Controls */}
      {!loading && events.length > 0 && pagination.totalPages > 1 && (
        <Flex justify="center" mt={12} gap={2}>
          <Button
            onClick={() => changePage(pagination.page - 1)}
            isDisabled={pagination.page === 1}
            variant="outline"
            colorScheme="brand"
          >
            Previous
          </Button>
          {[...Array(pagination.totalPages)].map((_, i) => (
            <Button
              key={i + 1}
              onClick={() => changePage(i + 1)}
              variant={pagination.page === i + 1 ? 'solid' : 'ghost'}
              colorScheme="brand"
            >
              {i + 1}
            </Button>
          ))}
          <Button
            onClick={() => changePage(pagination.page + 1)}
            isDisabled={pagination.page === pagination.totalPages}
            variant="outline"
            colorScheme="brand"
          >
            Next
          </Button>
        </Flex>
      )}

      {/* Filters Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="white" color="gray.800">
          <DrawerCloseButton color="gray.800" />
          <DrawerHeader borderBottomWidth="1px" borderColor="gray.100">Filter Events</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" py={4}>
              <Box>
                <Text mb={2} fontWeight="medium">Category</Text>
                <Select
                  placeholder="All categories"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  bg="white"
                  borderColor="gray.200"
                  color="gray.800"
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
                  bg="white"
                  borderColor="gray.200"
                  color="gray.800"
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
    </Box>
  );
};

export default Home;