import React from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  Flex,
  Avatar,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiCalendar, FiMap, FiUsers, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const About = () => {
  const cardBg = 'white';
  const textColor = 'gray.600';

  const features = [
    {
      icon: FiCalendar,
      title: 'Event Discovery',
      description: 'Find the best events happening around Alliance University and Bangalore',
    },
    {
      icon: FiMap,
      title: 'Interactive Map',
      description: 'See event locations on an interactive map with detailed information',
    },
    {
      icon: FiUsers,
      title: 'Community',
      description: 'Connect with other students and event organizers',
    },
    {
      icon: FiHeart,
      title: 'Personalized',
      description: 'Save events you love and get recommendations based on your interests',
    },
  ];

  const team = [
    {
      name: 'Pranav Kalvium',
      role: 'Founder & Developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'OpenDoor Team',
      role: 'Development',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Alliance Community',
      role: 'Contributors',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=face',
    },
  ];

  return (
    <Container maxW="container.xl" py={12}>
      {/* Hero Section */}
      <VStack spacing={8} textAlign="center" mb={16}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading
            size="2xl"
            mb={4}
            bgGradient="linear(to-r, brand.500, brand.400)"
            bgClip="text"
          >
            About OpenDoor
          </Heading>
          <Text fontSize="xl" color={textColor} maxW="2xl" mx="auto">
            Connecting Alliance University students with the best events happening on campus and around Bangalore
          </Text>
        </MotionBox>
      </VStack>

      {/* Mission Section */}
      <Box mb={16}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="center">
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Heading size="xl" mb={6}>
              Our Mission
            </Heading>
            <Text fontSize="lg" color={textColor} mb={4}>
              OpenDoor was created to solve the problem of event discovery for Alliance University students. 
              We believe that college is about more than just classes - it's about experiences, 
              connections, and making the most of your time at one of India's leading universities.
            </Text>
            <Text fontSize="lg" color={textColor}>
              Our platform brings together events from across the university and the city, 
              making it easy to find everything from academic lectures to social gatherings, 
              cultural events to career fairs.
            </Text>
          </MotionBox>
          
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Box
              bg="gray.50"
              p={8}
              borderRadius="lg"
            >
              <VStack spacing={4}>
                <Icon as={FiHeart} w={12} h={12} color="brand.500" />
                <Heading size="lg">Join Our Community</Heading>
                <Text textAlign="center" color={textColor}>
                  Thousands of Alliance University students are already using OpenDoor to discover and attend amazing events
                </Text>
                <Button colorScheme="brand" size="lg" mt={4}>
                  Get Started
                </Button>
              </VStack>
            </Box>
          </MotionBox>
        </SimpleGrid>
      </Box>

      {/* Features Section */}
      <Box mb={16}>
        <Heading size="xl" textAlign="center" mb={12}>
          Why Choose OpenDoor?
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {features.map((feature, index) => (
            <MotionCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              bg={cardBg}
              border="1px solid"
              borderColor="gray.200"
              _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}
            >
              <CardBody textAlign="center" p={6}>
                <Icon as={feature.icon} w={10} h={10} color="brand.500" mb={4} />
                <Heading size="md" mb={3}>{feature.title}</Heading>
                <Text color={textColor}>{feature.description}</Text>
              </CardBody>
            </MotionCard>
          ))}
        </SimpleGrid>
      </Box>

      {/* Team Section */}
      <Box mb={16}>
        <Heading size="xl" textAlign="center" mb={12}>
          Our Team
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {team.map((member, index) => (
            <MotionBox
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              textAlign="center"
            >
              <Avatar
                size="xl"
                name={member.name}
                src={member.avatar}
                mb={4}
                mx="auto"
                border="4px solid"
                borderColor="gray.100"
              />
              <Heading size="md" mb={2}>{member.name}</Heading>
              <Text color={textColor}>{member.role}</Text>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Box>

      {/* Stats Section */}
      <Box bg="gray.50" p={8} borderRadius="lg" border="1px solid" borderColor="gray.200">
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} textAlign="center">
          <Box>
            <Heading size="2xl" color="brand.500">500+</Heading>
            <Text color={textColor}>Events</Text>
          </Box>
          <Box>
            <Heading size="2xl" color="teal.500">2K+</Heading>
            <Text color={textColor}>Users</Text>
          </Box>
          <Box>
            <Heading size="2xl" color="green.500">100+</Heading>
            <Text color={textColor}>Organizers</Text>
          </Box>
          <Box>
            <Heading size="2xl" color="yellow.600">24/7</Heading>
            <Text color={textColor}>Available</Text>
          </Box>
        </SimpleGrid>
      </Box>
    </Container>
  );
};

export default About;