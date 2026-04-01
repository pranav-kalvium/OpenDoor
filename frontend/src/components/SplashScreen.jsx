import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, keyframes, usePrefersReducedMotion } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

const pulseRing = keyframes`
  0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); }
  100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
`;

const SplashScreen = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Show splash screen for 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 800); // Wait for exit animation to complete before unmounting
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const animation = prefersReducedMotion ? undefined : `${pulseRing} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
        >
          <Flex
            h="100vh"
            w="100vw"
            bg="#F0FDF4"
            position="relative"
            overflow="hidden"
            align="center"
            justify="center"
            direction="column"
          >
            {/* Background glowing orbs */}
            <Box
              position="absolute"
              top="20%"
              left="30%"
              w="300px"
              h="300px"
              bg="brand.300"
              filter="blur(150px)"
              opacity={0.4}
              borderRadius="full"
            />
            <Box
              position="absolute"
              bottom="20%"
              right="30%"
              w="300px"
              h="300px"
              bg="brand.100"
              filter="blur(150px)"
              opacity={0.6}
              borderRadius="full"
            />

            {/* Main Logo Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, type: "spring", bounce: 0.5 }}
            >
              <Flex direction="column" align="center" justify="center">
                <Box
                  position="relative"
                  w="100px"
                  h="100px"
                  borderRadius="full"
                  bg="white"
                  border="1px solid rgba(0,0,0,0.05)"
                  backdropFilter="blur(10px)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  animation={animation}
                  mb={6}
                  boxShadow="0 8px 32px 0 rgba(16, 185, 129, 0.15)"
                >
                  <Text fontSize="4xl" fontWeight="900" color="brand.500" letterSpacing="tight">
                    OD
                  </Text>
                </Box>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <Text
                    fontSize="3xl"
                    fontWeight="800"
                    color="gray.800"
                    letterSpacing="wider"
                    fontFamily="heading"
                  >
                    <Text as="span" color="brand.500">Open</Text>Door
                  </Text>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  <Text mt={2} color="gray.500" fontSize="sm" letterSpacing="widest" textTransform="uppercase">
                    Alliance University
                  </Text>
                </motion.div>
              </Flex>
            </motion.div>
          </Flex>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
