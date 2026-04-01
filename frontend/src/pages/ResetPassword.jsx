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
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const MotionBox = motion(Box);

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast({
        title: 'Passwords mismatch',
        description: "The passwords you entered don't match.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    if (password.length < 6) {
      return toast({
        title: 'Password too short',
        description: "Password must be at least 6 characters long.",
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }

    setIsLoading(true);

    try {
      const response = await authAPI.resetPassword(token, { password });
      toast({
        title: 'Success',
        description: response.message || 'Your password has been reset successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to reset password. The link might be expired.',
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
                Reset Password
              </Heading>
              <Text color="gray.600" textAlign="center">
                Enter your new password below.
              </Text>
            </VStack>

            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color="gray.600">New Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    color="gray.800"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    _focus={{ bg: 'white', ring: 2, ringColor: 'brand.400' }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="gray.600">Confirm Password</FormLabel>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  loadingText="Resetting..."
                >
                  Reset Password
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>
      </MotionBox>
    </Container>
  );
}
