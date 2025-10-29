import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const EventCard = ({ event, onEventUpdate }) => {
  const [isSaved, setIsSaved] = useState(event.isSaved || false);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthenticated } = useAuth();
  const toast = useToast();



  const handleSaveEvent = async () => {
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
        variant="outline"
        bg="whiteAlpha.200" // Slightly more opaque background for better contrast
        backdropFilter="blur(10px)"
        border="1px solid"
        borderColor="whiteAlpha.300" 
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        transition="all 0.3s"
      >
        <CardHeader p={4}>
          <Flex justify="space-between" align="center">
            <Badge colorScheme="purple" px={2} py={1} borderRadius="full" color="white">
              {event.category || 'Event'}
            </Badge>
            <IconButton
              icon={isSaved ? <FaHeart /> : <FaRegHeart />}
              colorScheme={isSaved ? 'pink' : 'gray'}
              aria-label={isSaved ? 'Unsave event' : 'Save event'}
              isLoading={isLoading}
              onClick={handleSaveEvent}
              variant="ghost"
              isRound
              color="whiteAlpha.900"
            />
          </Flex>
          <Heading size="md" mt={2} noOfLines={1} color="whiteAlpha.900">
            {event.title}
          </Heading>
        </CardHeader>

        <CardBody p={4} pt={0}>
          {event.image && (
            <Image
              src={event.image}
              alt={event.title}
              borderRadius="lg"
              height="200px"
              width="100%"
              objectFit="cover"
              mb={4}
            />
          )}
          
          <Text noOfLines={3} mb={4} color="whiteAlpha.800">
            {event.description}
          </Text>

          <Flex direction="column" gap={2}>
            <Flex align="center">
              <FaCalendarAlt color="#CBD5E0" />
              <Text ml={2} fontSize="sm" color="whiteAlpha.700">
                {formatDate(event.date)}
              </Text>
            </Flex>
            
            <Flex align="center">
              <FaClock color="#CBD5E0" />
              <Text ml={2} fontSize="sm" color="whiteAlpha.700">
                {formatTime(event.date)}
              </Text>
            </Flex>
            
            <Flex align="center">
              <FaMapMarkerAlt color="#CBD5E0" />
              <Text ml={2} fontSize="sm" color="whiteAlpha.700" noOfLines={1}>
                {typeof event.location === 'object' ? event.location.address : event.location}
              </Text>
            </Flex>
          </Flex>
        </CardBody>

        <CardFooter p={4} pt={0}>
          <Button
            variant="solid"
            colorScheme="blue"
            width="full"
            onClick={onOpen}
          >
            View Details
          </Button>
        </CardFooter>
      </MotionCard>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>{event.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {event.image && (
              <Image
                src={event.image}
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
                <FaCalendarAlt />
                <Text ml={2} fontWeight="medium">Date:</Text>
                <Text ml={2}>{formatDate(event.date)}</Text>
              </Flex>
              
              <Flex align="center">
                <FaClock />
                <Text ml={2} fontWeight="medium">Time:</Text>
                <Text ml={2}>{formatTime(event.date)}</Text>
              </Flex>
              
              <Flex align="center">
                <FaMapMarkerAlt />
                <Text ml={2} fontWeight="medium">Location:</Text>
                <Text ml={2}>
                   {typeof event.location === 'object' ? event.location.address : event.location}
                  </Text>
              </Flex>
              
              {event.website && (
                <Flex align="center">
                  <Text fontWeight="medium">Website:</Text>
                  <Text ml={2} color="blue.400" as="a" href={event.website} target="_blank" rel="noopener noreferrer">
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
              colorScheme="blue"
              onClick={() => {
                toast({
                  title: 'Registration',
                  description: 'Registration feature coming soon!',
                  status: 'info',
                  duration: 3000,
                  isClosable: true,
                });
              }}
            >
              Register
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EventCard;
