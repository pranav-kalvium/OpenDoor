import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
  Link,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        toast({
          title: 'Login successful!',
          status: 'success',
          duration: 3000,
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={12}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          bg="whiteAlpha.100"
          p={8}
          borderRadius="lg"
          boxShadow="xl"
          backdropFilter="blur(10px)"
        >
          <VStack spacing={6} align="stretch">
            <Box textAlign="center">
              <Heading size="xl" mb={2} bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
                Welcome Back
              </Heading>
              <Text color="gray.400">Sign in to your OpenDoor account</Text>
            </Box>

            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isInvalid={errors.email}>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    size="lg"
                    bg="whiteAlpha.50"
                    borderColor="whiteAlpha.200"
                    _hover={{ borderColor: 'whiteAlpha.300' }}
                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.password}>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      size="lg"
                      bg="whiteAlpha.50"
                      borderColor="whiteAlpha.200"
                      _hover={{ borderColor: 'whiteAlpha.300' }}
                      _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                    />
                    <InputRightElement height="100%">
                      <IconButton
                        variant="ghost"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                <Flex justify="flex-end" w="100%">
                  <Link
                    as={RouterLink}
                    to="/forgot-password"
                    color="blue.400"
                    fontSize="sm"
                    _hover={{ color: 'blue.300' }}
                  >
                    Forgot password?
                  </Link>
                </Flex>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  isLoading={isLoading}
                  loadingText="Signing in..."
                  mt={4}
                >
                  Sign In
                </Button>
              </VStack>
            </form>

            <Box textAlign="center" pt={4}>
              <Text color="gray.400">
                Don't have an account?{' '}
                <Link
                  as={RouterLink}
                  to="/register"
                  color="blue.400"
                  _hover={{ color: 'blue.300' }}
                >
                  Sign up
                </Link>
              </Text>
            </Box>
          </VStack>
        </Box>

        {/* Demo Accounts */}
        <Box mt={8} p={6} bg="whiteAlpha.50" borderRadius="lg">
          <Heading size="md" mb={4} textAlign="center">
            Demo Accounts
          </Heading>
          <VStack spacing={2} align="stretch">
            <Text fontSize="sm" color="gray.400">
              <strong>Email:</strong> demo@opendoor.com • <strong>Password:</strong> demo123
            </Text>
            <Text fontSize="sm" color="gray.400">
              <strong>Email:</strong> admin@opendoor.com • <strong>Password:</strong> admin123
            </Text>
          </VStack>
        </Box>
      </MotionBox>
    </Container>
  );
};

export default Login;