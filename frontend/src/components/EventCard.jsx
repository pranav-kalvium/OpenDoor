import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
  Image,
  Button,
  Badge,
  Flex,
  IconButton,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
  Tooltip,
  Icon
} from '@chakra-ui/react';
import { FiHeart, FiCalendar, FiClock, FiEdit2, FiTrash2, FiMapPin } from 'react-icons/fi';
import { eventsAPI, registrationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

// Resolve image URL: if it starts with /uploads, prepend the backend base
const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads')) return `${API_BASE}${url}`;
  return url;
};

const EventCard = ({ event, onEventUpdate }) => {
  const [isSaved, setIsSaved] = useState(event.isSaved || false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  // Check registration status when modal opens
  useEffect(() => {
    const checkReg = async () => {
      if (isOpen && isAuthenticated && event._id) {
        try {
          const res = await registrationsAPI.checkRegistration(event._id);
          setIsRegistered(res.isRegistered);
        } catch (err) {
          // silently fail
        }
      }
    };
    checkReg();
  }, [isOpen, isAuthenticated, event._id]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast({ title: 'Please login to register', status: 'warning', duration: 3000 });
      return;
    }
    setRegLoading(true);
    try {
      if (isRegistered) {
        await registrationsAPI.unregister(event._id);
        setIsRegistered(false);
        toast({ title: 'Unregistered successfully', status: 'info', duration: 3000 });
      } else {
        await registrationsAPI.register(event._id);
        setIsRegistered(true);
        toast({ title: 'Registered successfully!', status: 'success', duration: 3000 });
      }
    } catch (err) {
      toast({
        title: isRegistered ? 'Failed to unregister' : 'Failed to register',
        description: err.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setRegLoading(false);
    }
  };

  const handleDeleteEvent = async (e) => {
    e.stopPropagation(); // prevent opening modal
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      await eventsAPI.delete(event._id);
      toast({ title: 'Event deleted successfully', status: 'success', duration: 3000 });
      if (onEventUpdate) onEventUpdate();
    } catch (err) {
      toast({
        title: 'Error deleting event',
        description: err.response?.data?.message || 'Failed to delete event',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveEvent = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please login to save events',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isSaved) {
        await eventsAPI.unsaveEvent(event._id);
        setIsSaved(false);
        toast({
          title: 'Event removed',
          description: 'Event removed from your saved events',
          status: 'info',
          duration: 2000,
          isClosable: true,
        });
      } else {
        await eventsAPI.saveEvent(event._id);
        setIsSaved(true);
        toast({
          title: 'Event saved',
          description: 'Event added to your saved events',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
      
      if (onEventUpdate) onEventUpdate();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: 'Error',
        description: 'Failed to save event. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <MotionCard
        maxW="md"
        mx="auto"
        overflow="hidden"
        variant="elevated"
        className="glass-card"
        transition={{ duration: 0.3, ease: 'easeOut' }}
        bg="#FFFFFF"
        borderColor="gray.100"
        borderRadius="2xl"
        position="relative"
        _hover={{
          boxShadow: 'xl',
          borderColor: 'gray.200',
          transform: 'translateY(-4px)',
        }}
        transition="all 0.3s ease"
      >
        <Box position="relative" height="220px" overflow="hidden">
          {resolveImageUrl(event.image) ? (
            <Image
              src={resolveImageUrl(event.image)}
              alt={event.title}
              width="100%"
              height="100%"
              objectFit="cover"
              transition="transform 0.5s ease"
              _hover={{ transform: 'scale(1.05)' }}
            />
          ) : (
            <Box width="100%" height="100%" bg="gray.100" display="flex" alignItems="center" justifyContent="center">
              <Text color="gray.400">No Image Available</Text>
            </Box>
          )}

          {/* Top Gradient Overlay for badges */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            height="80px"
            bgGradient="linear(to-b, rgba(0,0,0,0.8), transparent)"
            pointerEvents="none"
          />

          <Flex
            position="absolute"
            top={3}
            left={3}
            right={3}
            justify="space-between"
            align="flex-start"
          >
            <Badge
              colorScheme="green"
              px={3}
              py={1}
              borderRadius="full"
              fontWeight="bold"
              bg="rgba(16, 185, 129, 0.9)"
              color="white"
              backdropFilter="blur(4px)"
              textTransform="uppercase"
              letterSpacing="wider"
              fontSize="xs"
            >
              {event.category || 'Event'}
            </Badge>

            <IconButton
              icon={<Icon as={FiHeart} fill={isSaved ? "currentColor" : "transparent"} />}
              colorScheme={isSaved ? 'pink' : 'gray'}
              bg={isSaved ? 'white' : 'rgba(255,255,255,0.8)'}
              color={isSaved ? 'pink.500' : 'gray.600'}
              aria-label={isSaved ? 'Unsave event' : 'Save event'}
              isLoading={isLoading}
              onClick={handleSaveEvent}
              isRound
              size="sm"
              backdropFilter="blur(4px)"
              _hover={{ bg: 'white', transform: 'scale(1.1)', color: 'pink.500' }}
              transition="all 0.2s"
            />
          </Flex>
        </Box>

        <CardBody pt={4} px={5} pb={2}>
          <Heading 
            size="md" 
            mb={2} 
            noOfLines={1} 
            color="gray.800"
            fontWeight="bold"
            letterSpacing="tight"
          >
            {event.title}
          </Heading>
          
          <Text noOfLines={2} mb={5} color="gray.500" fontSize="sm" lineHeight="tall">
            {event.description}
          </Text>

          <Flex direction="column" gap={3}>
            <Flex align="center" color="brand.500">
              <Icon as={FiCalendar} boxSize={4} />
              <Text ml={3} fontSize="sm" fontWeight="medium" color="gray.600">
                {formatDate(event.date || event.start_time)}
              </Text>
            </Flex>
            
            <Flex align="center" color="brand.500">
              <Icon as={FiClock} boxSize={4} />
              <Text ml={3} fontSize="sm" fontWeight="medium" color="gray.600">
                {formatTime(event.date || event.start_time)}
              </Text>
            </Flex>
            
            <Flex align="center" color="brand.500">
              <Icon as={FiMapPin} boxSize={4} />
              <Text ml={3} fontSize="sm" fontWeight="medium" color="gray.600" noOfLines={1}>
                {typeof event.location === 'object' ? event.location.address : event.location}
              </Text>
            </Flex>
          </Flex>
        </CardBody>

        <CardFooter pt={3} px={5} pb={5} display="flex" justifyContent="space-between" alignItems="center" gap={3}>
          <Button
            variant="outline"
            color="gray.800"
            bg="white"
            borderColor="gray.200"
            flex="1"
            onClick={onOpen}
            _hover={{
              bg: 'brand.500',
              color: 'white',
              borderColor: 'brand.500',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            }}
            transition="all 0.3s"
          >
            View Details
          </Button>
          
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <Flex gap={2}>
              <Tooltip label="Edit Event" bg="gray.800" color="white" placement="top" borderRadius="md">
                <IconButton
                  as="a"
                  href={`/events/${event._id}/edit`}
                  icon={<Icon as={FiEdit2} />}
                  size="md"
                  variant="outline"
                  colorScheme="gray"
                  borderColor="gray.200"
                  _hover={{ bg: 'brand.500', color: 'white', borderColor: 'brand.500' }}
                  onClick={(e) => e.stopPropagation()}
                />
              </Tooltip>
              <Tooltip label="Delete Event" bg="red.600" color="white" placement="top" borderRadius="md">
                <IconButton
                  icon={<Icon as={FiTrash2} />}
                  size="md"
                  variant="outline"
                  colorScheme="gray"
                  borderColor="gray.200"
                  _hover={{ bg: 'red.500', color: 'white', borderColor: 'red.500' }}
                  onClick={handleDeleteEvent}
                  isLoading={isDeleting}
                />
              </Tooltip>
            </Flex>
          )}
        </CardFooter>
      </MotionCard>

      <Modal isOpen={isOpen} onClose={onClose} size="xl" motionPreset="scale">
        <ModalOverlay />
        <ModalContent bg="white" color="gray.800">
          <ModalHeader>{event.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {resolveImageUrl(event.image) && (
              <Image
                src={resolveImageUrl(event.image)}
                alt={event.title}
                borderRadius="lg"
                width="100%"
                height="250px"
                objectFit="cover"
                mb={4}
              />
            )}
            
            <Text mb={4}>{event.description}</Text>
            
            <Flex direction="column" gap={3} mb={4}>
              <Flex align="center">
                <Icon as={FiCalendar} />
                <Text ml={2} fontWeight="medium">Date:</Text>
                <Text ml={2}>{formatDate(event.date || event.start_time)}</Text>
              </Flex>
              
              <Flex align="center">
                <Icon as={FiClock} />
                <Text ml={2} fontWeight="medium">Time:</Text>
                <Text ml={2}>{formatTime(event.date || event.start_time)}</Text>
              </Flex>
              
              <Flex align="center">
                <Icon as={FiMapPin} />
                <Text ml={2} fontWeight="medium">Location:</Text>
                <Text ml={2}>
                   {typeof event.location === 'object' ? event.location.address : event.location}
                  </Text>
              </Flex>
              
              {event.website && (
                <Flex align="center">
                  <Text fontWeight="medium">Website:</Text>
                  <Text ml={2} color="brand.500" as="a" href={event.website} target="_blank" rel="noopener noreferrer">
                    {event.website}
                  </Text>
                </Flex>
              )}
            </Flex>
            
            {event.price && (
              <Badge colorScheme="green" fontSize="md" p={2}>
                Price: {event.price}
              </Badge>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme={isRegistered ? 'red' : 'brand'}
              onClick={handleRegister}
              isLoading={regLoading}
            >
              {isRegistered ? 'Unregister' : 'Register'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EventCard;
