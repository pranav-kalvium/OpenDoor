// components/Navbar.jsx
import React from 'react';
import {
  Box,
  Flex,
  Button,
  Heading,
  Spacer,
  useColorModeValue
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box 
      as="nav" 
      bg={bgColor} 
      borderBottom="1px" 
      borderColor={borderColor}
      px={4}
      py={3}
    >
      <Flex align="center">
        <Heading as={RouterLink} to="/" size="lg" color="blue.600">
          OpenDoor
        </Heading>
        
        <Spacer />
        
        <Flex align="center" gap={4}>
          <Button as={RouterLink} to="/map" variant="ghost">
            Map
          </Button>
          <Button as={RouterLink} to="/list" variant="ghost">
            Events
          </Button>
          
          {user ? (
            <>
              <Button as={RouterLink} to="/profile" variant="ghost">
                Profile
              </Button>
              <Button onClick={handleLogout} colorScheme="red" variant="outline">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={RouterLink} to="/login" variant="outline">
                Login
              </Button>
              <Button as={RouterLink} to="/register" colorScheme="blue">
                Sign Up
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;