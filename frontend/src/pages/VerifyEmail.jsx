import React, { useEffect, useState } from 'react';
import { Box, Container, Heading, Text, VStack, Button, Spinner } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { authAPI } from '../services/api';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await authAPI.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Email verified successfully! You can now log in.');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
      }
    };

    if (token) verifyToken();
  }, [token]);

  return (
    <Container maxW="lg" py={20}>
      <MotionBox
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          className="glass-card"
          py={12}
          px={8}
          borderRadius="xl"
          textAlign="center"
        >
          <VStack spacing={6}>
            {status === 'loading' && (
              <>
                <Spinner size="xl" color="brand.400" thickness="4px" />
                <Heading size="md" color="gray.800">Verifying your email...</Heading>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircleIcon boxSize={16} color="green.500" />
                <Heading size="lg" color="gray.800">Verified!</Heading>
                <Text color="gray.600">{message}</Text>
                <Button colorScheme="brand" width="full" onClick={() => navigate('/login')}>
                  Go to Login
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <WarningTwoIcon boxSize={16} color="red.500" />
                <Heading size="lg" color="gray.800">Verification Failed</Heading>
                <Text color="gray.600">{message}</Text>
                <Button colorScheme="brand" variant="outline" width="full" onClick={() => navigate('/')}>
                  Go to Home
                </Button>
              </>
            )}
          </VStack>
        </Box>
      </MotionBox>
    </Container>
  );
}
