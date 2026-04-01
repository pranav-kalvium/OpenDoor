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
  Divider,
  Icon,
} from '@chakra-ui/react';
import { FiEdit2, FiCalendar, FiHeart, FiBook, FiGithub, FiLinkedin, FiSettings, FiLock, FiUpload, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { eventsAPI, authAPI } from '../services/api';
import EventCard from '../components/EventCard';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [savedEvents, setSavedEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  
  // Tab control inside the Edit Modal
  const [editTabIndex, setEditTabIndex] = useState(0);

  // Profile Edit State
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    avatar: '',
    bio: '',
    course: '',
    semester: '',
    interests: [],
    skills: [],
    github: '',
    linkedin: ''
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchUserEvents = useCallback(async () => {
    try {
      const [savedResponse, createdResponse] = await Promise.all([
        eventsAPI.getAll({ saved: true }),
        eventsAPI.getAll({ createdBy: user._id || user.id }),
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
        avatar: user.profile?.avatar || '',
        bio: user.profile?.bio || '',
        course: user.profile?.course || '',
        semester: user.profile?.semester || '',
        interests: user.profile?.interests || [],
        skills: user.profile?.skills || [],
        github: user.profile?.github || '',
        linkedin: user.profile?.linkedin || '',
      });
      fetchUserEvents();
    }
  }, [user, fetchUserEvents]);

  const handleSaveProfile = async () => {
    try {
      // Use FormData so we can send the file
      const formData = new FormData();
      formData.append('firstName', editForm.firstName);
      formData.append('lastName', editForm.lastName);
      formData.append('bio', editForm.bio);
      formData.append('course', editForm.course);
      formData.append('semester', editForm.semester);
      // Append arrays correctly
      editForm.interests.forEach(i => formData.append('interests[]', i));
      editForm.skills.forEach(s => formData.append('skills[]', s));
      formData.append('github', editForm.github);
      formData.append('linkedin', editForm.linkedin);
      
      // If we selected a new file, append it. Otherwise keep the existing URL if any.
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      } else if (editForm.avatar) {
        formData.append('avatar', editForm.avatar);
      }

      const response = await authAPI.updateProfile(formData);
      if (response.success) {
        updateUser(response.user);
        onClose();
        toast({
          title: 'Profile updated successfully',
          status: 'success',
          duration: 3000,
        });
      }
    } catch (err) {
      toast({
        title: 'Error updating profile',
        description: err.response?.data?.message || 'Failed to update profile',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3000,
      });
    }
    
    if (passwordForm.newPassword.length < 6) {
      return toast({
        title: 'Password too short',
        description: 'Must be at least 6 characters',
        status: 'error',
        duration: 3000,
      });
    }

    try {
      setIsChangingPassword(true);
      const res = await authAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      if (res.success) {
        toast({ title: 'Password updated', status: 'success', duration: 3000 });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        onClose();
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to update password',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleEventUpdate = () => {
    fetchUserEvents();
  };

  const addArrayItem = (field, value) => {
    if (value && !editForm[field].includes(value)) {
      setEditForm(prev => ({ ...prev, [field]: [...prev[field], value] }));
    }
  };

  const removeArrayItem = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: prev[field].filter(i => i !== value) }));
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  // derived data
  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently';
  const roleDisplay = user.role === 'admin' ? 'Administrator' : user.role === 'manager' ? 'Event Manager' : 'Student';
  
  return (
    <Container maxW="container.xl" py={8} as={motion.div} variants={containerVariants} initial="hidden" animate="visible">
      {/* Profile Header with Cover Image */}
      <MotionBox variants={itemVariants} className="glass-card" overflow="hidden" mb={8} position="relative">
        <Box 
          h="200px" 
          w="100%" 
          bgGradient="linear(to-r, brand.500, brand.400)"
          position="relative"
        >
          {/* subtle pattern overlay */}
          <Box position="absolute" top={0} left={0} right={0} bottom={0} opacity={0.15} backgroundImage="radial-gradient(circle at 2px 2px, black 1px, transparent 0)" backgroundSize="24px 24px" />
        </Box>
        
        <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'center', md: 'flex-start' }} px={8} pb={8} mt="-60px" gap={6}>
          <Box position="relative">
            <Avatar
              size="2xl"
              name={`${user.profile?.firstName} ${user.profile?.lastName}` || user.username}
              src={user.profile?.avatar}
              bg="gray.100"
              border="6px solid"
              borderColor="white"
              boxShadow="xl"
            >
              <AvatarBadge boxSize="1em" bg="green.500" borderWidth="4px" />
            </Avatar>
            <IconButton
              aria-label="Edit profile"
              icon={<FiEdit2 />}
              size="sm"
              position="absolute"
              bottom={2}
              right={2}
              borderRadius="full"
              colorScheme="brand"
              onClick={() => { setEditTabIndex(0); onOpen(); }}
              boxShadow="md"
            />
          </Box>
          
          <Box flex="1" pt={{ base: 4, md: 16 }} textAlign={{ base: 'center', md: 'left' }}>
            <Flex justify="space-between" align="flex-start" direction={{ base: 'column', md: 'row' }}>
              <Box>
                <Heading size="2xl" mb={2} letterSpacing="tight" fontWeight="extrabold">
                  {user.profile?.firstName && user.profile?.lastName
                    ? `${user.profile.firstName} ${user.profile.lastName}`
                    : user.username}
                </Heading>
                <HStack spacing={3} justify={{ base: 'center', md: 'flex-start' }} color="gray.400" mb={4}>
                  <Text fontWeight="bold" color="brand.500">@{user.username}</Text>
                  <Text>•</Text>
                  <Text>{roleDisplay}</Text>
                  <Text>•</Text>
                  <Text>Joined {joinDate}</Text>
                </HStack>
                
                {(user.role === 'student' && user.profile?.course) && (
                  <Flex align="center" justify={{ base: 'center', md: 'flex-start' }} mb={4}>
                    <Icon as={FiBook} color="yellow.500" mr={2} strokeWidth={2.5}/>
                    <Text fontWeight="medium" color="gray.600" fontSize="lg">{user.profile.course} • Semester {user.profile.semester}</Text>
                  </Flex>
                )}
                
                <Text mb={4} color="gray.600" maxW="2xl" fontSize="md" lineHeight="tall">{user.profile?.bio || 'No bio yet. Share something about yourself!'}</Text>
              </Box>

              <HStack spacing={3} mt={{ base: 4, md: 0 }}>
                {user.profile?.github && (
                  <IconButton as="a" href={user.profile.github} target="_blank" aria-label="GitHub" icon={<FiGithub />} variant="ghost" colorScheme="gray" size="lg" isRound />
                )}
                {user.profile?.linkedin && (
                  <IconButton as="a" href={user.profile.linkedin} target="_blank" aria-label="LinkedIn" icon={<FiLinkedin />} variant="ghost" colorScheme="linkedin" size="lg" isRound />
                )}
                <Button leftIcon={<FiSettings />} onClick={() => { setEditTabIndex(0); onOpen(); }} variant="outline" colorScheme="gray" px={6}>
                  Settings
                </Button>
              </HStack>
            </Flex>

            {/* Tags area (only for students) */}
            {user.role === 'student' && (
              <Flex wrap="wrap" gap={6} mt={2}>
                {user.profile?.interests && user.profile.interests.length > 0 && (
                  <Box>
                    <Text fontSize="sm" textTransform="uppercase" letterSpacing="widest" color="brand.500" fontWeight="bold" mb={2}>Interests</Text>
                    <HStack flexWrap="wrap" spacing={2}>
                      {user.profile.interests.map((interest, index) => (
                        <Badge key={index} colorScheme="brand" variant="subtle" px={3} py={1.5} borderRadius="md" textTransform="none" fontSize="sm">
                          {interest}
                        </Badge>
                      ))}
                    </HStack>
                  </Box>
                )}

                {user.profile?.skills && user.profile.skills.length > 0 && (
                  <Box>
                    <Text fontSize="sm" textTransform="uppercase" letterSpacing="widest" color="teal.500" fontWeight="bold" mb={2}>Skills</Text>
                    <HStack flexWrap="wrap" spacing={2}>
                      {user.profile.skills.map((skill, index) => (
                        <Badge key={index} colorScheme="teal" variant="subtle" px={3} py={1.5} borderRadius="md" textTransform="none" fontSize="sm">
                          {skill}
                        </Badge>
                      ))}
                    </HStack>
                  </Box>
                )}
              </Flex>
            )}
          </Box>
        </Flex>
      </MotionBox>

      {/* Stats row - Dynamic instead of hardcoded */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={10} as={motion.div} variants={containerVariants}>
        <MotionCard variants={itemVariants} className="glass-card" _hover={{ transform: 'translateY(-5px)', transition: '0.2s' }}>
          <CardBody display="flex" alignItems="center" px={8} py={6}>
            <Box p={4} bg="red.500" bgGradient="linear(to-br, pink.400, red.500)" borderRadius="xl" color="white" mr={6} boxShadow="lg">
              <FiHeart size={28} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500" textTransform="uppercase" letterSpacing="wider" fontWeight="bold">Saved Events</Text>
              <Heading size="2xl" color="gray.800" mt={1}>{savedEvents.length}</Heading>
            </Box>
          </CardBody>
        </MotionCard>
        
        <MotionCard variants={itemVariants} className="glass-card" _hover={{ transform: 'translateY(-5px)', transition: '0.2s' }}>
          <CardBody display="flex" alignItems="center" px={8} py={6}>
            <Box p={4} bg="brand.500" bgGradient="linear(to-br, teal.400, brand.500)" borderRadius="xl" color="white" mr={6} boxShadow="lg">
              <FiCalendar size={28} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500" textTransform="uppercase" letterSpacing="wider" fontWeight="bold">Created Events</Text>
              <Heading size="2xl" color="gray.800" mt={1}>{createdEvents.length}</Heading>
            </Box>
          </CardBody>
        </MotionCard>
      </SimpleGrid>

      {/* Events Tabs */}
      <MotionBox variants={itemVariants}>
        <Tabs variant="soft-rounded" colorScheme="brand">
          <TabList mb={6} bg="gray.100" p={1} borderRadius="xl" display="inline-flex">
            <Tab borderRadius="lg" fontWeight="semibold">Saved Events ({savedEvents.length})</Tab>
            <Tab borderRadius="lg" fontWeight="semibold">Created Events ({createdEvents.length})</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              {savedEvents.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {savedEvents.map((event) => (
                    <EventCard key={event._id} event={event} onEventUpdate={handleEventUpdate} />
                  ))}
                </SimpleGrid>
              ) : (
                <Box textAlign="center" py={20} className="glass-card" borderRadius="2xl">
                  <Icon as={FiHeart} boxSize={12} color="gray.300" mb={4} strokeWidth={1.5} />
                  <Heading size="md" mb={2}>No saved events</Heading>
                  <Text color="gray.500" mb={6}>You haven't bookmarked any events yet.</Text>
                  <Button as="a" href="/" colorScheme="brand">Discover Events</Button>
                </Box>
              )}
            </TabPanel>

            <TabPanel px={0}>
              {createdEvents.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {createdEvents.map((event) => (
                    <EventCard key={event._id} event={event} onEventUpdate={handleEventUpdate} />
                  ))}
                </SimpleGrid>
              ) : (
                <Box textAlign="center" py={20} className="glass-card" borderRadius="2xl">
                  <Icon as={FiCalendar} boxSize={12} color="gray.300" mb={4} strokeWidth={1.5} />
                  <Heading size="md" mb={2}>No created events</Heading>
                  <Text color="gray.500" mb={6}>You haven't hosted any events yet.</Text>
                  {(user.role === 'manager' || user.role === 'admin') && (
                    <Button as="a" href="/events/create" colorScheme="brand" leftIcon={<FiEdit2/>}>Create Event</Button>
                  )}
                </Box>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </MotionBox>

      {/* Enhanced Multi-Tab Edit Profile Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" motionPreset="slideInBottom">
        <ModalOverlay backdropFilter="blur(5px)" bg="blackAlpha.700" />
        <ModalContent className="glass-card" bg="white" color="gray.800" border="1px solid" borderColor="gray.200">
          <ModalHeader py={4} borderBottomWidth="1px" borderColor="gray.100">Profile Settings</ModalHeader>
          <ModalCloseButton mt={2} />
          
          <Tabs index={editTabIndex} onChange={setEditTabIndex} orientation={{ base: "vertical", md: "horizontal" }} variant="enclosed" colorScheme="brand" display="flex" flexDirection="column">
            <TabList px={4} pt={4} borderBottom="none" gap={2} flexWrap="wrap">
              <Tab borderRadius="md" _selected={{ bg: 'brand.500', color: 'white', borderColor: 'transparent' }}><Icon as={FiUser} mr={2}/> Basic Info</Tab>
              {(user.role === 'student') && (
                <Tab borderRadius="md" _selected={{ bg: 'brand.500', color: 'white', borderColor: 'transparent' }}><Icon as={FiBook} mr={2}/> Academics</Tab>
              )}
              <Tab borderRadius="md" _selected={{ bg: 'brand.500', color: 'white', borderColor: 'transparent' }}><Icon as={FiGithub} mr={2}/> Social</Tab>
              <Tab borderRadius="md" _selected={{ bg: 'red.500', color: 'white', borderColor: 'transparent' }}><Icon as={FiLock} mr={2}/> Security</Tab>
            </TabList>

            <ModalBody py={6}>
              <TabPanels>
                {/* 1. Basic Info Tab */}
                <TabPanel p={0}>
                  <VStack spacing={5} align="stretch">
                    <Flex gap={4}>
                      <FormControl>
                        <FormLabel color="gray.600">First Name</FormLabel>
                        <Input value={editForm.firstName} onChange={(e) => setEditForm({...editForm, firstName: e.target.value})} bg="gray.100" border="none" _focus={{ ring: 2, ringColor: 'brand.400' }} />
                      </FormControl>
                      <FormControl>
                        <FormLabel color="gray.600">Last Name</FormLabel>
                        <Input value={editForm.lastName} onChange={(e) => setEditForm({...editForm, lastName: e.target.value})} bg="gray.100" border="none" _focus={{ ring: 2, ringColor: 'brand.400' }} />
                      </FormControl>
                    </Flex>

                    <FormControl>
                      <FormLabel color="gray.300">Profile Picture</FormLabel>
                      <HStack spacing={4}>
                        <Avatar size="md" src={avatarPreview || editForm.avatar} name={`${editForm.firstName} ${editForm.lastName}`} />
                        <Button
                          leftIcon={<FiUpload />}
                          onClick={() => document.getElementById('avatar-upload').click()}
                          bg="gray.100"
                          _hover={{ bg: 'gray.200' }}
                          variant="solid"
                        >
                          Upload Image
                        </Button>
                        <Input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          display="none"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              setAvatarFile(file);
                              setAvatarPreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </HStack>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel color="gray.300">Bio</FormLabel>
                      <Textarea value={editForm.bio} onChange={(e) => setEditForm({...editForm, bio: e.target.value})} rows={4} placeholder="Tell us about yourself..." bg="blackAlpha.300" border="none" />
                    </FormControl>
                  </VStack>
                  <Button w="100%" mt={8} colorScheme="brand" onClick={handleSaveProfile}>Save Basic Info</Button>
                </TabPanel>

                {/* 2. Academics Tab */}
                <TabPanel p={0}>
                  <VStack spacing={5} align="stretch">
                    <Flex gap={4}>
                      <FormControl>
                        <FormLabel color="gray.600">Course</FormLabel>
                        <Select value={editForm.course} onChange={(e) => setEditForm({...editForm, course: e.target.value})} bg="blackAlpha.300" border="none">
                          <option value="">Select course...</option>
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
                        <FormLabel color="gray.600">Semester</FormLabel>
                        <Select value={editForm.semester} onChange={(e) => setEditForm({...editForm, semester: e.target.value})} bg="blackAlpha.300" border="none">
                          <option value="">Select sem...</option>
                          {[1,2,3,4,5,6,7,8].map(sem => <option key={sem} value={sem}>Semester {sem}</option>)}
                        </Select>
                      </FormControl>
                    </Flex>
                    
                    <FormControl>
                      <FormLabel color="gray.600">Interests</FormLabel>
                      <Input placeholder="Type an interest and press Enter" bg="gray.100" border="none"
                        onKeyPress={(e) => { if (e.key === 'Enter' && e.target.value.trim()) { addArrayItem('interests', e.target.value.trim()); e.target.value = ''; } }}
                      />
                      <HStack mt={3} flexWrap="wrap" spacing={2}>
                        {editForm.interests.map((interest, index) => (
                          <Badge key={index} colorScheme="brand" px={3} py={1} borderRadius="full" cursor="pointer" onClick={() => removeArrayItem('interests', interest)} _hover={{ bg: 'red.500', color: 'white' }}>
                            {interest} ✕
                          </Badge>
                        ))}
                      </HStack>
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.600">Skills</FormLabel>
                      <Input placeholder="Type a skill and press Enter" bg="gray.100" border="none"
                        onKeyPress={(e) => { if (e.key === 'Enter' && e.target.value.trim()) { addArrayItem('skills', e.target.value.trim()); e.target.value = ''; } }}
                      />
                      <HStack mt={3} flexWrap="wrap" spacing={2}>
                        {editForm.skills.map((skill, index) => (
                          <Badge key={index} colorScheme="teal" px={3} py={1} borderRadius="full" cursor="pointer" onClick={() => removeArrayItem('skills', skill)} _hover={{ bg: 'red.500', color: 'white' }}>
                            {skill} ✕
                          </Badge>
                        ))}
                      </HStack>
                    </FormControl>
                  </VStack>
                  <Button w="100%" mt={8} colorScheme="brand" onClick={handleSaveProfile}>Save Academics & Skills</Button>
                </TabPanel>

                {/* 3. Social Tab */}
                <TabPanel p={0}>
                  <VStack spacing={5} align="stretch">
                    <Text color="gray.600" mb={2}>Connect your social profiles to let event organizers and other attendees find you.</Text>
                    <FormControl>
                      <FormLabel color="gray.600">GitHub Profile URL</FormLabel>
                      <HStack>
                        <Icon as={FiGithub} boxSize={5} color="gray.500" />
                        <Input value={editForm.github} onChange={(e) => setEditForm({...editForm, github: e.target.value})} placeholder="https://github.com/username" bg="gray.100" border="none" />
                      </HStack>
                    </FormControl>
                    <FormControl>
                      <FormLabel color="gray.600">LinkedIn Profile URL</FormLabel>
                      <HStack>
                        <Icon as={FiLinkedin} boxSize={5} color="linkedin.500" />
                        <Input value={editForm.linkedin} onChange={(e) => setEditForm({...editForm, linkedin: e.target.value})} placeholder="https://linkedin.com/in/username" bg="gray.100" border="none" />
                      </HStack>
                    </FormControl>
                  </VStack>
                  <Button w="100%" mt={8} colorScheme="brand" onClick={handleSaveProfile}>Save Social Links</Button>
                </TabPanel>

                {/* 4. Security Tab (Change Password) */}
                <TabPanel p={0}>
                  <VStack spacing={5} align="stretch">
                    <Text color="yellow.700" mb={2} bg="yellow.100" p={3} borderRadius="md" fontSize="sm">
                      Note: You will be required to login again after changing your password.
                    </Text>
                    <FormControl isRequired>
                      <FormLabel color="gray.600">Current Password</FormLabel>
                      <Input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})} bg="gray.100" border="none" />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel color="gray.600">New Password</FormLabel>
                      <Input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} bg="gray.100" border="none" minLength={6} />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel color="gray.600">Confirm New Password</FormLabel>
                      <Input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} bg="gray.100" border="none" />
                    </FormControl>
                  </VStack>
                  <Button w="100%" mt={8} colorScheme="red" onClick={handleChangePassword} isLoading={isChangingPassword}>
                    Update Password
                  </Button>
                </TabPanel>

              </TabPanels>
            </ModalBody>
          </Tabs>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Profile;
