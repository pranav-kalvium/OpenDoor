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
import { FiUser, FiMap, FiCalendar, FiPlus, FiSettings } from 'react-icons/fi';
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
        bg="rgba(255, 255, 255, 0.9)"
        color="gray.800"
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor="gray.100"
        align={'center'}
        backdropFilter="blur(12px)"
        boxShadow="0 4px 20px rgba(0, 0, 0, 0.05)"
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
            color="gray.900"
            fontWeight="bold"
            fontSize="xl"
            as={RouterLink}
            to="/"
          >
            OpenDoor
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav navItems={getNavItems(user?.role)} />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 'auto' }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
          alignItems={'center'}
        >
          {isAuthenticated ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
                zIndex={1001}
              >
                <Avatar
                  size={'sm'}
                  name={user?.username}
                  src={user?.profile?.avatar}
                  bg="brand.500"
                  color="white"
                />
              </MenuButton>
              <MenuList bg="white" borderColor="gray.100" zIndex={1500} boxShadow="lg">
                <MenuItem 
                  as={RouterLink} 
                  to="/profile"
                  _hover={{ bg: 'gray.50', color: 'brand.600' }}
                  icon={<FiUser />}
                >
                  Profile
                </MenuItem>
                <MenuDivider borderColor="gray.100" />
                <MenuItem 
                  onClick={handleLogout}
                  _hover={{ bg: 'gray.50', color: 'red.500' }}
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
                fontWeight={500}
                variant={'link'}
                to="/login"
                color="gray.600"
                _hover={{ color: 'brand.600' }}
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
                bg={'brand.500'}
                _hover={{
                  bg: 'brand.600',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav navItems={getNavItems(user?.role)} />
      </Collapse>
    </Box>
  );
}

const DesktopNav = ({ navItems }) => {
  const linkColor = 'gray.600';
  const linkHoverColor = 'brand.600';
  const popoverContentBgColor = 'white';

  return (
    <Stack direction={'row'} spacing={4} alignItems="center">
      {navItems.map((navItem) => (
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
            _groupHover={{ color: 'brand.500' }}
            fontWeight={500}
            color="gray.800"
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
          <Icon color={'brand.500'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = ({ navItems }) => {
  return (
    <Stack
      bg="white"
      p={4}
      display={{ md: 'none' }}
      borderBottom="1px solid"
      borderColor="gray.100"
    >
      {navItems.map((navItem) => (
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
          fontWeight={500}
          color="gray.700"
          display="flex"
          alignItems="center"
          gap={2}
          _hover={{ color: 'brand.600' }}
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
                color="gray.500"
                _hover={{ color: 'brand.600' }}
              >
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const getNavItems = (role) => {
  const items = [
    {
      label: 'Events',
      href: '/',
      icon: FiCalendar,
    },
    {
      label: 'Map',
      href: '/map',
      icon: FiMap,
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: FiUser,
    },
  ];

  if (role === 'manager' || role === 'admin') {
    items.push({
      label: 'Create Event',
      href: '/events/create',
      icon: FiPlus,
    });
  }

  if (role === 'admin') {
    items.push({
      label: 'Admin',
      href: '/admin',
      icon: FiSettings,
    });
  }

  return items;
};