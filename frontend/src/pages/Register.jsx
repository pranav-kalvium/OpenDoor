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
  Checkbox,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      
      if (result.success) {
        toast({
          title: 'Account created!',
          description: 'Welcome to OpenDoor!',
          status: 'success',
          duration: 3000,
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
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
                Join OpenDoor
              </Heading>
              <Text color="gray.400">Create your account to discover amazing events</Text>
            </Box>

            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isInvalid={errors.username}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="Choose a username"
                    size="lg"
                    bg="whiteAlpha.50"
                    borderColor="whiteAlpha.200"
                    _hover={{ borderColor: 'whiteAlpha.300' }}
                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                  />
                  <FormErrorMessage>{errors.username}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.email}>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
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
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Create a password"
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

                <FormControl isInvalid={errors.confirmPassword}>
                  <FormLabel>Confirm Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirm your password"
                      size="lg"
                      bg="whiteAlpha.50"
                      borderColor="whiteAlpha.200"
                      _hover={{ borderColor: 'whiteAlpha.300' }}
                      _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                    />
                    <InputRightElement height="100%">
                      <IconButton
                        variant="ghost"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.agreeToTerms}>
                  <Checkbox
                    isChecked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    colorScheme="blue"
                  >
                    I agree to the{' '}
                    <Link color="blue.400" href="/terms" isExternal>
                      Terms and Conditions
                    </Link>
                  </Checkbox>
                  <FormErrorMessage>{errors.agreeToTerms}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  isLoading={isLoading}
                  loadingText="Creating account..."
                  mt={4}
                >
                  Create Account
                </Button>
              </VStack>
            </form>

            <Box textAlign="center" pt={4}>
              <Text color="gray.400">
                Already have an account?{' '}
                <Link
                  as={RouterLink}
                  to="/login"
                  color="blue.400"
                  _hover={{ color: 'blue.300' }}
                >
                  Sign in
                </Link>
              </Text>
            </Box>
          </VStack>
        </Box>
      </MotionBox>
    </Container>
  );
};

export default Register;