import React from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useToast,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { FaMap, FaUser, FaCalendarAlt } from 'react-icons/fa';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PremiumNavbar() {
  const { isOpen, onToggle } = useDisclosure();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    navigate('/');
  };

  return (
    <Box position="fixed" top={0} width="100%" zIndex={1000}>
      <Flex
        bg={useColorModeValue('whiteAlpha.100', 'whiteAlpha.100')}
        color={useColorModeValue('gray.200', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('whiteAlpha.200', 'whiteAlpha.200')}
        align={'center'}
        backdropFilter="blur(10px)"
        boxShadow="0 4px 24px rgba(0, 0, 0, 0.1)"
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }} alignItems="center">
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('white', 'white')}
            fontWeight="bold"
            fontSize="xl"
            as={RouterLink}
            to="/"
          >
            OpenDoor
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
        >
          {isAuthenticated ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <Avatar
                  size={'sm'}
                  name={user?.username}
                  src={user?.profile?.avatar}
                  bg="blue.500"
                  color="white"
                />
              </MenuButton>
              <MenuList bg="gray.800" borderColor="whiteAlpha.200">
                <MenuItem 
                  as={RouterLink} 
                  to="/profile"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  icon={<FaUser />}
                >
                  Profile
                </MenuItem>
                <MenuDivider />
                <MenuItem 
                  onClick={handleLogout}
                  _hover={{ bg: 'whiteAlpha.100' }}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <>
              <Button
                as={RouterLink}
                fontSize={'sm'}
                fontWeight={400}
                variant={'link'}
                to="/login"
                color="whiteAlpha.800"
                _hover={{ color: 'white' }}
              >
                Sign In
              </Button>
              <Button
                as={RouterLink}
                to="/register"
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'blue.500'}
                _hover={{
                  bg: 'blue.600',
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.200', 'gray.200');
  const linkHoverColor = useColorModeValue('white', 'white');
  const popoverContentBgColor = useColorModeValue('gray.800', 'gray.800');

  return (
    <Stack direction={'row'} spacing={4} alignItems="center">
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                as={RouterLink}
                p={2}
                to={navItem.href ?? '#'}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
                display="flex"
                alignItems="center"
                gap={1}
              >
                {navItem.icon && <Icon as={navItem.icon} />}
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link
      as={RouterLink}
      to={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: 'whiteAlpha.100' }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'blue.400' }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={'sm'} color="gray.400">
            {subLabel}
          </Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color={'blue.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('gray.800', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
      borderBottom="1px solid"
      borderColor="whiteAlpha.200"
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href, icon: NavIcon }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={RouterLink}
        to={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.200', 'gray.200')}
          display="flex"
          alignItems="center"
          gap={2}
        >
          {NavIcon && <NavIcon />}
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.700', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Link 
                key={child.label} 
                as={RouterLink}
                to={child.href} 
                py={2}
                color="gray.400"
                _hover={{ color: 'white' }}
              >
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: 'Events',
    href: '/',
    icon: FaCalendarAlt,
  },
  {
    label: 'Map',
    href: '/map',
    icon: FaMap,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: FaUser,
  },
];