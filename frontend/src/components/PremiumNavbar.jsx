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
  VStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MotionBox, MotionText } from '../utils/motion';

const PremiumNavbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <Box 
        as="nav" 
        position="fixed" 
        top={0} 
        left={0} 
        right={0} 
        zIndex={1000}
        bg="rgba(15, 15, 30, 0.95)"
        backdropFilter="blur(20px)"
        borderBottom="1px solid"
        borderColor="rgba(255, 255, 255, 0.1)"
        px={{ base: 4, md: 8 }}
        py={3}
      >
        <Flex 
          align="center" 
          justify="space-between"
          maxW="1400px" 
          mx="auto"
          height="60px"
        >
          {/* Logo */}
          <MotionBox
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            flexShrink={0}
          >
            <RouterLink to="/">
              <Heading 
                as="h1" 
                size="lg" 
                bg="linear-gradient(135deg, #818CF8 0%, #06B6D4 100%)"
                bgClip="text"
                position="relative"
                fontSize={{ base: 'xl', md: '2xl' }}
              >
                OpenDoor
                {isHovered && (
                  <MotionBox
                    position="absolute"
                    bottom={-1}
                    left={0}
                    w="100%"
                    h="1px"
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
          <HStack 
            spacing={{ base: 4, lg: 8 }} 
            display={{ base: 'none', md: 'flex' }}
            flex={1}
            justify="center"
            mx={8}
          >
            <NavItem to="/map" isActive={isActive('/map')}>
              Map
            </NavItem>
            <NavItem to="/list" isActive={isActive('/list')}>
              Events
            </NavItem>
            <NavItem to="/about" isActive={isActive('/about')}>
              About
            </NavItem>
          </HStack>

          {/* User Section */}
          <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
            {isAuthenticated ? (
              <Menu>
                <MenuButton
                  as={Button}
                  variant="glass"
                  size="sm"
                  rightIcon={<ChevronDownIcon />}
                  leftIcon={<Avatar size="xs" name={user?.name} src={user?.avatar} />}
                >
                  <Text fontSize="sm" display={{ base: 'none', lg: 'block' }}>
                    {user?.name?.split(' ')[0]}
                  </Text>
                </MenuButton>
                <MenuList bg="premium.surface" borderColor="rgba(255, 255, 255, 0.1)">
                  <MenuItem 
                    as={RouterLink} 
                    to="/profile"
                    _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem 
                    onClick={handleLogout}
                    _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <HStack spacing={3}>
                <Button 
                  as={RouterLink} 
                  to="/login" 
                  variant="glass" 
                  size="sm"
                  _hover={{
                    transform: 'translateY(-1px)',
                    bg: 'rgba(255, 255, 255, 0.15)'
                  }}
                >
                  Login
                </Button>
                <Button 
                  as={RouterLink} 
                  to="/register" 
                  variant="premium" 
                  size="sm"
                  _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)'
                  }}
                >
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
            size="sm"
          />
        </Flex>
      </Box>

      {/* Mobile Drawer */}
      <Drawer placement="right" onClose={onClose} isOpen={isOpen} size="full">
        <DrawerOverlay />
        <DrawerContent bg="premium.darker" borderLeft="1px solid" borderColor="rgba(255, 255, 255, 0.1)">
          <DrawerHeader borderBottomWidth="1px" borderColor="rgba(255, 255, 255, 0.1)">
            <Flex justify="space-between" align="center">
              <Heading size="md">Menu</Heading>
              <IconButton
                icon={<CloseIcon />}
                onClick={onClose}
                variant="ghost"
                aria-label="Close menu"
                size="sm"
              />
            </Flex>
          </DrawerHeader>
          <DrawerBody py={8}>
            <VStack spacing={6} align="stretch">
              <NavItemMobile to="/" onClick={onClose} isActive={isActive('/')}>
                Home
              </NavItemMobile>
              <NavItemMobile to="/map" onClick={onClose} isActive={isActive('/map')}>
                Map
              </NavItemMobile>
              <NavItemMobile to="/list" onClick={onClose} isActive={isActive('/list')}>
                Events
              </NavItemMobile>
              <NavItemMobile to="/about" onClick={onClose} isActive={isActive('/about')}>
                About
              </NavItemMobile>

              <Box pt={8} borderTop="1px solid" borderColor="rgba(255, 255, 255, 0.1)">
                {isAuthenticated ? (
                  <VStack spacing={4}>
                    <NavItemMobile to="/profile" onClick={onClose}>
                      Profile
                    </NavItemMobile>
                    <Button
                      variant="outline"
                      colorScheme="red"
                      width="full"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </VStack>
                ) : (
                  <VStack spacing={3}>
                    <Button
                      as={RouterLink}
                      to="/login"
                      variant="outline"
                      width="full"
                      onClick={onClose}
                    >
                      Login
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/register"
                      variant="premium"
                      width="full"
                      onClick={onClose}
                    >
                      Sign Up
                    </Button>
                  </VStack>
                )}
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

// Animated Nav Item Component
const NavItem = ({ to, children, isActive }) => {
  const activeColor = useColorModeValue('premium.primary', 'premium.primaryLight');
  
  return (
    <MotionText
      as={RouterLink}
      to={to}
      fontWeight="600"
      color={isActive ? activeColor : 'premium.text.secondary'}
      _hover={{ color: 'premium.text.primary' }}
      position="relative"
      whileHover={{ scale: 1.05 }}
      fontSize={{ base: 'sm', lg: 'md' }}
    >
      {children}
      {isActive && (
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
    </MotionText>
  );
};

// Mobile Nav Item
const NavItemMobile = ({ to, onClick, children, isActive }) => {
  const activeColor = useColorModeValue('premium.primary', 'premium.primaryLight');
  
  return (
    <Button
      as={RouterLink}
      to={to}
      onClick={onClick}
      variant="ghost"
      justifyContent="flex-start"
      size="lg"
      color={isActive ? activeColor : 'premium.text.secondary'}
      _hover={{ 
        color: 'premium.text.primary',
        bg: 'rgba(255, 255, 255, 0.05)',
        transform: 'translateX(8px)'
      }}
      transition="all 0.2s ease-in-out"
      leftIcon={isActive ? <Box w={2} h={2} bg={activeColor} borderRadius="full" /> : undefined}
    >
      {children}
    </Button>
  );
};

export default PremiumNavbar;