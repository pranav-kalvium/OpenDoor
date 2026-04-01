import React from 'react';
import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  useColorModeValue,
  Flex,
  Icon
} from '@chakra-ui/react';
import { FiInstagram, FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi';

const SocialButton = ({ children, label, href }) => {
  return (
    <Box
      as="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      w={10}
      h={10}
      cursor={'pointer'}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      color="whiteAlpha.700"
      _hover={{
        color: 'brand.500',
        bg: 'whiteAlpha.100',
        borderRadius: 'full'
      }}
    >
      <Text srOnly>{label}</Text>
      {children}
    </Box>
  );
};

export default function Footer() {
  return (
    <Box
      bg="#1A202C"
      color="gray.200"
      borderTop="1px solid"
      borderColor="whiteAlpha.50"
      mt="auto"
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={8}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Flex align="center" gap={2}>
          <Text fontWeight="bold" fontSize="lg" color="white">
            OpenDoor
          </Text>
          <Text fontSize="sm" color="whiteAlpha.700">
            © {new Date().getFullYear()} Alliance University Events. All rights reserved.
          </Text>
        </Flex>

        <Stack direction={'row'} spacing={6}>
          <SocialButton label={'Twitter'} href={'#'}>
            <Icon as={FiTwitter} w={5} h={5} />
          </SocialButton>
          <SocialButton label={'LinkedIn'} href={'#'}>
            <Icon as={FiLinkedin} w={5} h={5} />
          </SocialButton>
          <SocialButton label={'Instagram'} href={'#'}>
            <Icon as={FiInstagram} w={5} h={5} />
          </SocialButton>
          <SocialButton label={'GitHub'} href={'https://github.com/pranav-kalvium/OpenDoor'}>
            <Icon as={FiGithub} w={5} h={5} />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
}
