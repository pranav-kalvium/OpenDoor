import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import PremiumNavbar from './PremiumNavbar';
import Footer from './Footer';

const PremiumLayout = ({ children }) => {
  return (
    <Box
      minH="100vh"
      bg="#F0FDF4"
      backgroundAttachment="fixed"
      position="relative"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 15% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 85% 30%, rgba(52, 211, 153, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 50% 80%, rgba(5, 150, 105, 0.03) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      <PremiumNavbar />
      <Flex
        as="main"
        direction="column"
        pt="80px"
        flex="1"
        position="relative"
        zIndex={1}
      >
        {children}
      </Flex>
      <Box position="relative" zIndex={1} mt="auto">
        <Footer />
      </Box>
    </Box>
  );
};

export default PremiumLayout;