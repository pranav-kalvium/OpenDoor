// components/PremiumNavbar.jsx
import React, { useState } from 'react';
import {
  Box,
  Flex,
  Button,
  Heading,
  Text,
  HStack,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  VStack
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionText = motion(Text);

const PremiumNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <Box 
        as="nav" 
        position="fixed" 
        top={0} 
        left={0} 
        right={0} 
        zIndex={1000}
        bg="rgba(15, 15, 30, 0.8)"
        backdropFilter="blur(20px)"
        borderBottom="1px solid"
        borderColor="rgba(255, 255, 255, 0.08)"
      >
        <Flex 
          align="center" 
          justify="space-between" 
          px={{ base: 4, md: 8 }} 
          py={4}
          maxW="1400px" 
          mx="auto"
        >
          {/* Logo */}
          <MotionBox
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <RouterLink to="/">
              <Heading 
                as="h1" 
                size="lg" 
                bg="linear-gradient(135deg, #818CF8 0%, #06B6D4 100%)"
                bgClip="text"
                position="relative"
              >
                OpenDoor
                {isHovered && (
                  <MotionBox
                    position="absolute"
                    bottom={-2}
                    left={0}
                    w="100%"
                    h="2px"
                    bg="linear-gradient(135deg, #818CF8 0%, #06B6D4 100%)"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Heading>
            </RouterLink>
          </MotionBox>

          {/* Desktop Navigation */}
          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            <NavItem to="/map">Map</NavItem>
            <NavItem to="/list">Events</NavItem>
            <NavItem to="/about">About</NavItem>
            
            {user ? (
              <HStack spacing={4}>
                <Button variant="glass" size="sm">
                  Profile
                </Button>
                <Button 
                  variant="premium" 
                  size="sm"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                >
                  Logout
                </Button>
              </HStack>
            ) : (
              <HStack spacing={4}>
                <Button variant="glass" as={RouterLink} to="/login" size="sm">
                  Login
                </Button>
                <Button variant="premium" as={RouterLink} to="/register" size="sm">
                  Sign Up
                </Button>
              </HStack>
            )}
          </HStack>

          {/* Mobile Menu Button */}
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            variant="glass"
            aria-label="Open menu"
          />
        </Flex>
      </Box>

      {/* Mobile Drawer */}
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="premium.surface" borderLeft="1px solid" borderColor="rgba(255, 255, 255, 0.08)">
          <DrawerHeader borderBottomWidth="1px" borderColor="rgba(255, 255, 255, 0.08)">
            <Heading size="md">Menu</Heading>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" pt={4}>
              <NavItemMobile to="/" onClick={onClose}>Home</NavItemMobile>
              <NavItemMobile to="/map" onClick={onClose}>Map</NavItemMobile>
              <NavItemMobile to="/list" onClick={onClose}>Events</NavItemMobile>
              <NavItemMobile to="/about" onClick={onClose}>About</NavItemMobile>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

// Animated Nav Item Component
const NavItem = ({ to, children }) => (
  <MotionText
    as={RouterLink}
    to={to}
    fontWeight="500"
    color="premium.text.secondary"
    _hover={{ color: 'premium.text.primary' }}
    position="relative"
    whileHover={{ scale: 1.05 }}
  >
    {children}
    <MotionBox
      position="absolute"
      bottom={-2}
      left={0}
      w="100%"
      h="1px"
      bg="linear-gradient(135deg, #818CF8 0%, #06B6D4 100%)"
      initial={{ scaleX: 0 }}
      whileHover={{ scaleX: 1 }}
      transition={{ duration: 0.3 }}
    />
  </MotionText>
);

// Mobile Nav Item
const NavItemMobile = ({ to, onClick, children }) => (
  <Button
    as={RouterLink}
    to={to}
    onClick={onClick}
    variant="ghost"
    justifyContent="flex-start"
    color="premium.text.secondary"
    _hover={{ 
      color: 'premium.text.primary',
      bg: 'rgba(255, 255, 255, 0.05)'
    }}
  >
    {children}
  </Button>
);

export default PremiumNavbar;