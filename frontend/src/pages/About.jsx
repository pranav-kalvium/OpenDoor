// pages/About.jsx
import React from 'react';
import { Container, Heading, Text, VStack, Box } from '@chakra-ui/react';
import PremiumLayout from '../components/PremiumLayout';

const About = () => {
  return (
    <PremiumLayout>
      <Container maxW="container.xl" py={20}>
        <VStack spacing={8} textAlign="center">
          <Heading as="h1" size="2xl" bg="linear-gradient(135deg, #818CF8 0%, #06B6D4 100%)" bgClip="text">
            About OpenDoor
          </Heading>
          <Text fontSize="xl" color="premium.text.secondary" maxW="600px">
            OpenDoor is your gateway to discovering amazing events around campus. 
            We bring together all events in one beautiful, intuitive platform.
          </Text>
          <Box p={8} bg="premium.surface" borderRadius="2xl" border="1px solid" borderColor="rgba(255, 255, 255, 0.1)">
            <Text>More content coming soon...</Text>
          </Box>
        </VStack>
      </Container>
    </PremiumLayout>
  );
};

export default About;