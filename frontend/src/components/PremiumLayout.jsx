import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import PremiumNavbar from './PremiumNavbar';

const PremiumLayout = ({ children }) => {
  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #0f0f23 0%, #1a202c 100%)"
      backgroundAttachment="fixed"
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 15% 50%, rgba(29, 78, 216, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 85% 30%, rgba(245, 101, 101, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 50% 80%, rgba(214, 158, 46, 0.1) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
      }}
    >
      <PremiumNavbar />
      <Flex
        as="main"
        direction="column"
        pt="80px"
        minH="calc(100vh - 80px)"
        position="relative"
        zIndex={1}
      >
        {children}
      </Flex>
    </Box>
  );
};

export default PremiumLayout;