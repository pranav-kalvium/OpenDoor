// pages/Profile.jsx
import React from 'react';
import { Container, Heading, Text, Box, VStack, Button } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Container maxW="md" py={10}>
        <Text>Please log in to view your profile.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="md" py={10}>
      <VStack spacing={6}>
        <Heading>Your Profile</Heading>
        
        <Box p={6} borderWidth="1px" borderRadius="md" width="100%">
          <VStack spacing={3} align="start">
            <Text><strong>Email:</strong> {user.email}</Text>
            <Text><strong>Saved Events:</strong> 0</Text>
            <Text><strong>Member Since:</strong> Today!</Text>
          </VStack>
        </Box>

        <Button colorScheme="blue" width="100%">
          Edit Profile
        </Button>
        
        <Button 
          variant="outline" 
          colorScheme="red" 
          width="100%"
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          Logout
        </Button>
      </VStack>
    </Container>
  );
};

export default Profile;