// components/PremiumLayout.jsx
import React from 'react';
import { Box } from '@chakra-ui/react';
import { MotionBox } from '../utils/motion'; // Update import


const PremiumLayout = ({ children }) => {
  return (
    <Box
      minH="100vh"
      bg="premium.dark"
      backgroundImage={`
        radial-gradient(at 27% 37%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
        radial-gradient(at 97% 21%, rgba(6, 182, 212, 0.15) 0px, transparent 50%),
        radial-gradient(at 52% 99%, rgba(245, 158, 11, 0.1) 0px, transparent 50%)
      `}
      position="relative"
      overflow="hidden"
    >
      {/* Animated background elements */}
      <MotionBox
        position="absolute"
        top="-20%"
        right="-10%"
        w="600px"
        h="600px"
        bg="premium.primary"
        opacity={0.15}
        borderRadius="full"
        filter="blur(100px)"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <MotionBox
        position="absolute"
        bottom="-10%"
        left="-5%"
        w="400px"
        h="400px"
        bg="premium.secondary"
        opacity={0.1}
        borderRadius="full"
        filter="blur(80px)"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [180, 270, 180]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Content */}
      <Box position="relative" zIndex={1}>
        {children}
      </Box>
    </Box>
  );
};

export default PremiumLayout;