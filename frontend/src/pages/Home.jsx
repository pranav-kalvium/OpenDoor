// pages/Home.jsx
import React from 'react';
import { 
  Container, VStack, Heading, Text, Button, Box, 
  SimpleGrid, Icon, useBreakpointValue, Stat
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { MotionBox, MotionHeading, MotionText } from '../utils/motion';
import { MapPin, Calendar, Users, Star } from 'lucide-react';
import PremiumLayout from '../components/PremiumLayout';

const Home = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <PremiumLayout>
      {/* Hero Section */}
      <Box position="relative" overflow="hidden">
        <Container maxW="container.xl" pt={{ base: 32, md: 40 }} pb={{ base: 20, md: 32 }}>
          <VStack spacing={8} textAlign="center" position="relative" zIndex={2}>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Text
                color="premium.primaryLight"
                fontWeight="600"
                fontSize="sm"
                letterSpacing="wide"
                textTransform="uppercase"
                mb={4}
              >
                Discover Your Campus
              </Text>
              
              <MotionHeading
                as="h1"
                size={{ base: '3xl', md: '4xl' }}
                fontWeight="800"
                lineHeight="1.1"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Never Miss{' '}
                <Box
                  as="span"
                  bg="linear-gradient(135deg, #818CF8 0%, #06B6D4 50%, #F59E0B 100%)"
                  bgClip="text"
                  display={{ base: 'block', md: 'inline' }}
                >
                  Amazing Events
                </Box>
              </MotionHeading>
            </MotionBox>

            <MotionText
              fontSize={{ base: 'lg', md: 'xl' }}
              color="premium.text.secondary"
              maxW="600px"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              OpenDoor brings all campus events together in one beautiful, interactive platform. 
              Find your next adventure with our intelligent event discovery system.
            </MotionText>

            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                as={RouterLink}
                to="/map"
                variant="premium"
                size="lg"
                rightIcon={<MapPin size={20} />}
                mr={4}
                mb={{ base: 4, md: 0 }}
              >
                Explore Map
              </Button>
              <Button
                as={RouterLink}
                to="/list"
                variant="glass"
                size="lg"
                rightIcon={<Calendar size={20} />}
              >
                View Events
              </Button>
            </MotionBox>
          </VStack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxW="container.xl" py={20}>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
          <StatCard
            icon={Users}
            number="500+"
            label="Active Users"
            delay={0.1}
          />
          <StatCard
            icon={Calendar}
            number="127"
            label="Upcoming Events"
            delay={0.2}
          />
          <StatCard
            icon={MapPin}
            number="15"
            label="Locations"
            delay={0.3}
          />
          <StatCard
            icon={Star}
            number="4.9"
            label="Rating"
            delay={0.4}
          />
        </SimpleGrid>
      </Container>
    </PremiumLayout>
  );
};

// Stat Card Component
const StatCard = ({ icon, number, label, delay }) => (
  <MotionBox
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    textAlign="center"
    p={6}
    bg="premium.surface"
    border="1px solid"
    borderColor="rgba(255, 255, 255, 0.08)"
    borderRadius="2xl"
    _hover={{
      transform: 'translateY(-8px)',
      borderColor: 'premium.primary',
      boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15)',
      transition: 'all 0.3s ease-in-out'
    }}
  >
    <Icon as={icon} w={8} h={8} color="premium.primary" mb={4} />
    <Box fontSize="3xl" fontWeight="700" color="premium.text.primary" mb={1}>
      {number}
    </Box>
    <Box color="premium.text.secondary" fontSize="sm" fontWeight="500">
      {label}
    </Box>
  </MotionBox>
);

export default Home;