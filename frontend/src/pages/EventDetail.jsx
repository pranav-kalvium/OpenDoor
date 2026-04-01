import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Heading,
  Text,
  Image,
  Badge,
  Button,
  Flex,
  HStack,
  VStack,
  useToast,
  Spinner,
  Divider,
  Card,
  CardBody,
} from '@chakra-ui/react';
import {
  FiCalendar,
  FiMapPin,
  FiClock,
  FiArrowLeft,
  FiHeart,
  FiGlobe,
  FiUser,
  FiUsers,
} from 'react-icons/fi';
import { Icon } from '@chakra-ui/react';
import { eventsAPI, registrationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads')) return `${API_BASE}${url}`;
  return url;
};

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await eventsAPI.getById(id);
        if (res.success) {
          setEvent(res.data);
          setIsSaved(res.data.isSaved || false);
        }
      } catch (err) {
        toast({ title: 'Event not found', status: 'error', duration: 3000 });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    const checkReg = async () => {
      if (isAuthenticated && id) {
        try {
          const res = await registrationsAPI.checkRegistration(id);
          setIsRegistered(res.isRegistered);
        } catch (err) { /* silent */ }
      }
    };
    checkReg();
  }, [isAuthenticated, id]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast({ title: 'Please login to register', status: 'warning', duration: 3000 });
      return;
    }
    setRegLoading(true);
    try {
      if (isRegistered) {
        await registrationsAPI.unregister(id);
        setIsRegistered(false);
        toast({ title: 'Unregistered successfully', status: 'info', duration: 3000 });
      } else {
        await registrationsAPI.register(id);
        setIsRegistered(true);
        toast({ title: 'Registered successfully!', status: 'success', duration: 3000 });
      }
    } catch (err) {
      toast({
        title: 'Registration failed',
        description: err.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setRegLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast({ title: 'Please login to save events', status: 'warning', duration: 3000 });
      return;
    }
    try {
      if (isSaved) {
        await eventsAPI.unsaveEvent(id);
        setIsSaved(false);
      } else {
        await eventsAPI.saveEvent(id);
        setIsSaved(true);
      }
    } catch (err) {
      toast({ title: 'Failed to save event', status: 'error', duration: 3000 });
    }
  };

  const formatDate = (date) => {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getLocationString = (location) => {
    if (typeof location === 'string') return location;
    if (location?.address) return location.address;
    return 'Location not specified';
  };

  const getCategoryColor = (category) => {
    const colors = {
      academic: 'yellow',
      social: 'green',
      cultural: 'orange',
      sports: 'teal',
      career: 'brand',
      other: 'gray',
    };
    return colors[category] || 'gray';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <Spinner size="xl" color="brand.500" />
      </Box>
    );
  }

  if (!event) return null;

  return (
    <Container maxW="container.lg" py={8}>
      {/* Back Button */}
      <Button
        leftIcon={<FiArrowLeft />}
        variant="ghost"
        mb={6}
        onClick={() => navigate(-1)}
        color="gray.600"
        _hover={{ color: 'brand.600' }}
      >
        Back to Events
      </Button>

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Event Image */}
        {resolveImageUrl(event.image) && (
          <Box borderRadius="lg" overflow="hidden" mb={8} maxH="400px">
            <Image
              src={resolveImageUrl(event.image)}
              alt={event.title}
              w="100%"
              h="400px"
              objectFit="cover"
            />
          </Box>
        )}

        {/* Header */}
        <Flex justify="space-between" align="start" mb={6} direction={{ base: 'column', md: 'row' }} gap={4}>
          <Box flex="1">
            <HStack mb={3}>
              <Badge
                colorScheme={getCategoryColor(event.category)}
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="full"
              >
                {event.category}
              </Badge>
              {event.price && event.price !== 'Free' && (
                <Badge colorScheme="green" fontSize="sm" px={3} py={1} borderRadius="full">
                  {event.price}
                </Badge>
              )}
              {event.price === 'Free' && (
                <Badge colorScheme="green" fontSize="sm" px={3} py={1} borderRadius="full">
                  Free
                </Badge>
              )}
            </HStack>
            <Heading size="xl" mb={2}>
              {event.title}
            </Heading>
          </Box>

          <HStack>
            <Button
              leftIcon={isSaved ? <Icon as={FiHeart} fill="currentColor" /> : <FiHeart />}
              variant="outline"
              colorScheme={isSaved ? 'red' : 'gray'}
              onClick={handleSave}
            >
              {isSaved ? 'Saved' : 'Save'}
            </Button>
            <Button
              colorScheme={isRegistered ? 'red' : 'brand'}
              onClick={handleRegister}
              isLoading={regLoading}
              size="lg"
            >
              {isRegistered ? 'Unregister' : 'Register Now'}
            </Button>
          </HStack>
        </Flex>

        {/* Event Details Grid */}
        <Flex gap={8} direction={{ base: 'column', md: 'row' }}>
          {/* Main Content */}
          <Box flex="2">
            <Card className="glass-card" mb={6}>
              <CardBody>
                <Heading size="md" mb={4}>About this Event</Heading>
                <Text whiteSpace="pre-wrap" lineHeight="1.8">
                  {event.description}
                </Text>
              </CardBody>
            </Card>

            {event.website && (
              <Card className="glass-card" mb={6}>
                <CardBody>
                  <Flex align="center">
                    <FiGlobe color="#10b981" />
                    <Text ml={2}>
                      <a href={event.website} target="_blank" rel="noopener noreferrer" style={{ color: '#059669' }}>
                        {event.website}
                      </a>
                    </Text>
                  </Flex>
                </CardBody>
              </Card>
            )}
          </Box>

          {/* Sidebar */}
          <Box flex="1">
            <Card className="glass-card" mb={6}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Heading size="sm" mb={2}>Event Details</Heading>

                  <Flex align="center">
                    <FiCalendar color="#10b981" />
                    <Box ml={3}>
                      <Text fontSize="sm" color="gray.500">Date</Text>
                      <Text>{formatDate(event.start_time || event.date)}</Text>
                    </Box>
                  </Flex>

                  {event.end_time && (
                    <Flex align="center">
                      <FiClock color="#10b981" />
                      <Box ml={3}>
                        <Text fontSize="sm" color="gray.500">Ends</Text>
                        <Text>{formatDate(event.end_time)}</Text>
                      </Box>
                    </Flex>
                  )}

                  <Flex align="center">
                    <FiMapPin color="#EF4444" />
                    <Box ml={3}>
                      <Text fontSize="sm" color="gray.500">Location</Text>
                      <Text>{getLocationString(event.location)}</Text>
                    </Box>
                  </Flex>

                  {event.registration_deadline && (
                    <>
                      <Divider />
                      <Flex align="center">
                        <FiClock color="#F59E0B" />
                        <Box ml={3}>
                          <Text fontSize="sm" color="gray.500">Registration Deadline</Text>
                          <Text>{formatDate(event.registration_deadline)}</Text>
                        </Box>
                      </Flex>
                    </>
                  )}

                  {event.max_attendees && (
                    <Flex align="center">
                      <FiUsers color="#059669" />
                      <Box ml={3}>
                        <Text fontSize="sm" color="gray.500">Max Attendees</Text>
                        <Text>{event.max_attendees}</Text>
                      </Box>
                    </Flex>
                  )}

                  <Divider />

                  <Flex align="center">
                    <FiUser color="#34D399" />
                    <Box ml={3}>
                      <Text fontSize="sm" color="gray.500">Organizer</Text>
                      <Text>{event.createdBy?.username || 'Alliance University'}</Text>
                    </Box>
                  </Flex>
                </VStack>
              </CardBody>
            </Card>
          </Box>
        </Flex>
      </MotionBox>
    </Container>
  );
};

export default EventDetail;
