import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  Link,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { authAPI } from '../services/api';

const MotionBox = motion(Box);

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.forgotPassword({ email });
      toast({
        title: 'Check your email',
        description: response.message || 'If an account with that email exists, we sent a password reset link.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setEmail('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send reset email.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="lg" py={{ base: 12, md: 24 }} px={{ base: 0, sm: 8 }}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          className="glass-card"
          py={8}
          px={{ base: 4, sm: 10 }}
          borderRadius={{ base: 'none', sm: 'xl' }}
        >
          <VStack spacing={6} align="stretch">
            <VStack spacing={2} align="center" mb={4}>
              <Heading size="lg" color="gray.800" textAlign="center">
                Forgot Password
              </Heading>
              <Text color="gray.600" textAlign="center">
                Enter your Alliance email and we'll send you a reset link.
              </Text>
            </VStack>

            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color="gray.600">Email Address</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    color="gray.800"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    _focus={{ bg: 'white', ring: 2, ringColor: 'brand.400' }}
                  />
                </FormControl>

                <Button
                  w="full"
                  colorScheme="brand"
                  type="submit"
                  isLoading={isLoading}
                  loadingText="Sending..."
                >
                  Send Reset Link
                </Button>
              </VStack>
            </form>

            <Text align="center" color="gray.600">
              Remember your password?{' '}
              <Link as={RouterLink} to="/login" color="brand.600">
                Log in here
              </Link>
            </Text>
          </VStack>
        </Box>
      </MotionBox>
    </Container>
  );
}
