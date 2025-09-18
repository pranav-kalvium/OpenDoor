import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  Avatar,
  Button,
  VStack,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  SimpleGrid,
  Card,
  CardBody,
  Flex,
  Badge,
  useToast,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Select,
  AvatarBadge,
  IconButton,
  Progress,
  Divider,
} from '@chakra-ui/react';
import { FaEdit, FaCalendarAlt, FaHeart, FaGraduationCap, FaUserFriends, FaAward } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { eventsAPI } from '../services/api';
import EventCard from '../components/EventCard';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [savedEvents, setSavedEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    course: '',
    semester: '',
    interests: [],
    skills: [],
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchUserEvents = useCallback(async () => {
    try {
      const [savedResponse, createdResponse] = await Promise.all([
        eventsAPI.getAll({ saved: true }),
        eventsAPI.getAll({ createdBy: user.id }),
      ]);

      if (savedResponse.success) setSavedEvents(savedResponse.data.events);
      if (createdResponse.success) setCreatedEvents(createdResponse.data.events);
    } catch (err) {
      toast({
        title: 'Error loading events',
        description: 'Failed to load your events',
        status: 'error',
        duration: 3000,
      });
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        bio: user.profile?.bio || '',
        course: user.profile?.course || '',
        semester: user.profile?.semester || '',
        interests: user.profile?.interests || [],
        skills: user.profile?.skills || [],
      });
      fetchUserEvents();
    }
  }, [user, fetchUserEvents]);

  const handleSaveProfile = async () => {
    try {
      updateUser({
        profile: {
          ...user.profile,
          ...editForm
        }
      });
      
      onClose();
      toast({
        title: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: 'Error updating profile',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleEventUpdate = () => {
    fetchUserEvents();
  };

  const addInterest = (interest) => {
    if (interest && !editForm.interests.includes(interest)) {
      setEditForm(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
  };

  const removeInterest = (interest) => {
    setEditForm(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const addSkill = (skill) => {
    if (skill && !editForm.skills.includes(skill)) {
      setEditForm(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skill) => {
    setEditForm(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  if (!user) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Please log in to view your profile</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      {/* Profile Header */}
      <Box className="glass-card" p={8} mb={8}>
        <Flex direction={{ base: 'column', md: 'row' }} align="center" gap={6}>
          <Box position="relative">
            <Avatar
              size="2xl"
              name={`${user.profile?.firstName} ${user.profile?.lastName}` || user.username}
              src={user.profile?.avatar}
              bg="blue.500"
              border="4px solid"
              borderColor="whiteAlpha.300"
            >
              <AvatarBadge boxSize="1.25em" bg="green.500" />
            </Avatar>
            <IconButton
              aria-label="Edit profile"
              icon={<FaEdit />}
              size="sm"
              position="absolute"
              bottom={2}
              right={2}
              borderRadius="full"
              onClick={onOpen}
            />
          </Box>
          
          <Box flex="1">
            <Heading size="xl" mb={2}>
              {user.profile?.firstName && user.profile?.lastName
                ? `${user.profile.firstName} ${user.profile.lastName}`
                : user.username}
            </Heading>
            <Text color="gray.400" mb={2}>@{user.username}</Text>
            
            {user.profile?.course && (
              <Flex align="center" mb={2}>
                <FaGraduationCap color="#718096" />
                <Text ml={2}>{user.profile.course} • Semester {user.profile.semester}</Text>
              </Flex>
            )}
            
            <Text mb={4}>{user.profile?.bio || 'No bio yet. Share something about yourself!'}</Text>
            
            {user.profile?.interests && user.profile.interests.length > 0 && (
              <HStack mb={4} flexWrap="wrap">
                {user.profile.interests.map((interest, index) => (
                  <Badge key={index} colorScheme="blue" variant="subtle" px={2} py={1}>
                    {interest}
                  </Badge>
                ))}
              </HStack>
            )}

            {user.profile?.skills && user.profile.skills.length > 0 && (
              <HStack mb={4} flexWrap="wrap">
                {user.profile.skills.map((skill, index) => (
                  <Badge key={index} colorScheme="green" variant="subtle" px={2} py={1}>
                    {skill}
                  </Badge>
                ))}
              </HStack>
            )}
          </Box>

          <Button leftIcon={<FaEdit />} onClick={onOpen} variant="outline">
            Edit Profile
          </Button>
        </Flex>
      </Box>

      {/* Stats */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card className="glass-card">
          <CardBody textAlign="center">
            <FaHeart size={24} color="#E53E3E" style={{ margin: '0 auto 12px' }} />
            <Heading size="2xl" color="red.400">
              {savedEvents.length}
            </Heading>
            <Text>Saved Events</Text>
          </CardBody>
        </Card>
        
        <Card className="glass-card">
          <CardBody textAlign="center">
            <FaCalendarAlt size={24} color="#3182CE" style={{ margin: '0 auto 12px' }} />
            <Heading size="2xl" color="blue.400">
              {createdEvents.length}
            </Heading>
            <Text>Created Events</Text>
          </CardBody>
        </Card>
        
        <Card className="glass-card">
          <CardBody textAlign="center">
            <FaUserFriends size={24} color="#D69E2E" style={{ margin: '0 auto 12px' }} />
            <Heading size="2xl" color="yellow.400">
              47
            </Heading>
            <Text>Connections</Text>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Progress Section */}
      <Card className="glass-card" mb={8}>
        <CardBody>
          <Heading size="md" mb={4}>Campus Engagement</Heading>
          <VStack spacing={4} align="stretch">
            <Box>
              <Flex justify="space-between" mb={2}>
                <Text>Event Participation</Text>
                <Text>75%</Text>
              </Flex>
              <Progress value={75} colorScheme="blue" size="sm" borderRadius="full" />
            </Box>
            <Box>
              <Flex justify="space-between" mb={2}>
                <Text>Network Growth</Text>
                <Text>60%</Text>
              </Flex>
              <Progress value={60} colorScheme="green" size="sm" borderRadius="full" />
            </Box>
            <Box>
              <Flex justify="space-between" mb={2}>
                <Text>Skill Development</Text>
                <Text>85%</Text>
              </Flex>
              <Progress value={85} colorScheme="purple" size="sm" borderRadius="full" />
            </Box>
          </VStack>
        </CardBody>
      </Card>

      {/* Events Tabs */}
      <Tabs variant="soft-rounded" colorScheme="blue">
        <TabList mb={6}>
          <Tab>Saved Events ({savedEvents.length})</Tab>
          <Tab>Created Events ({createdEvents.length})</Tab>
          <Tab>My Network</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {savedEvents.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {savedEvents.map((event) => (
                  <EventCard 
                    key={event._id} 
                    event={event} 
                    onEventUpdate={handleEventUpdate}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Box textAlign="center" py={12} className="glass-card">
                <FaHeart size={48} color="gray" />
                <Text mt={4} color="gray.400">No saved events yet</Text>
                <Button mt={4} colorScheme="blue">
                  Browse Events
                </Button>
              </Box>
            )}
          </TabPanel>

          <TabPanel>
            {createdEvents.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {createdEvents.map((event) => (
                  <EventCard 
                    key={event._id} 
                    event={event} 
                    onEventUpdate={handleEventUpdate}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Box textAlign="center" py={12} className="glass-card">
                <FaCalendarAlt size={48} color="gray" />
                <Text mt={4} color="gray.400">No events created yet</Text>
                <Button mt={4} colorScheme="blue">
                  Create Event
                </Button>
              </Box>
            )}
          </TabPanel>

          <TabPanel>
            <Box textAlign="center" py={12} className="glass-card">
              <FaUserFriends size={48} color="gray" />
              <Text mt={4} color="gray.400">Network features coming soon</Text>
              <Text fontSize="sm" color="gray.500" mt={2}>
                Connect with other Alliance University students and build your professional network
              </Text>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Enhanced Edit Profile Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent className="glass-card" bg="rgba(26, 32, 44, 0.95)">
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Flex gap={4}>
                <FormControl>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                    placeholder="Enter your first name"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                    placeholder="Enter your last name"
                  />
                </FormControl>
              </Flex>

              <Flex gap={4}>
                <FormControl>
                  <FormLabel>Course</FormLabel>
                  <Select
                    value={editForm.course}
                    onChange={(e) => setEditForm({...editForm, course: e.target.value})}
                    placeholder="Select your course"
                  >
                    <option value="B.Tech">B.Tech</option>
                    <option value="MBA">MBA</option>
                    <option value="BBA">BBA</option>
                    <option value="B.Com">B.Com</option>
                    <option value="BA">BA</option>
                    <option value="B.Sc">B.Sc</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="PhD">PhD</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Semester</FormLabel>
                  <Select
                    value={editForm.semester}
                    onChange={(e) => setEditForm({...editForm, semester: e.target.value})}
                    placeholder="Select semester"
                  >
                    {[1,2,3,4,5,6,7,8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </Select>
                </FormControl>
              </Flex>
              
              <FormControl>
                <FormLabel>Bio</FormLabel>
                <Textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Interests (comma-separated)</FormLabel>
                <Input
                  placeholder="e.g., Programming, Music, Sports"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      addInterest(e.target.value.trim());
                      e.target.value = '';
                    }
                  }}
                />
                <HStack mt={2} flexWrap="wrap">
                  {editForm.interests.map((interest, index) => (
                    <Badge 
                      key={index} 
                      colorScheme="blue" 
                      px={2} 
                      py={1} 
                      borderRadius="full"
                      cursor="pointer"
                      onClick={() => removeInterest(interest)}
                    >
                      {interest} ×
                    </Badge>
                  ))}
                </HStack>
              </FormControl>

              <FormControl>
                <FormLabel>Skills (comma-separated)</FormLabel>
                <Input
                  placeholder="e.g., JavaScript, Python, Design"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      addSkill(e.target.value.trim());
                      e.target.value = '';
                    }
                  }}
                />
                <HStack mt={2} flexWrap="wrap">
                  {editForm.skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      colorScheme="green" 
                      px={2} 
                      py={1} 
                      borderRadius="full"
                      cursor="pointer"
                      onClick={() => removeSkill(skill)}
                    >
                      {skill} ×
                    </Badge>
                  ))}
                </HStack>
              </FormControl>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Profile;
