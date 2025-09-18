import { extendTheme } from '@chakra-ui/react';

const premiumTheme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    alliance: {
      primary: '#1a365d', // Alliance blue
      secondary: '#f56565', // Alliance red accent
      gold: '#d69e2e',
      purple: '#805ad5',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
  fonts: {
    heading: '"Poppins", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  styles: {
    global: {
      'html, body': {
        bg: 'linear-gradient(135deg, #0f0f23 0%, #1a202c 100%)',
        backgroundAttachment: 'fixed',
        color: 'white',
        minHeight: '100vh',
        fontFeatureSettings: '"ss01", "ss02", "cv01", "cv02"',
      },
      '*::placeholder': {
        color: 'gray.400',
      },
      '*, *::before, &::after': {
        borderColor: 'whiteAlpha.200',
      },
      '.glass-card': {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      '.glass-navbar': {
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
    },
  },
  components: {
    Button: {
      variants: {
        solid: {
          bg: 'linear-gradient(135deg, alliance.primary 0%, #2d3748 100%)',
          color: 'white',
          _hover: {
            bg: 'linear-gradient(135deg, #2d3748 0%, alliance.primary 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          },
          _active: {
            bg: 'linear-gradient(135deg, #1a202c 0%, alliance.primary 100%)',
          },
        },
        outline: {
          border: '2px solid',
          borderColor: 'whiteAlpha.300',
          color: 'white',
          _hover: {
            bg: 'whiteAlpha.100',
            borderColor: 'whiteAlpha.400',
          },
        },
        ghost: {
          color: 'whiteAlpha.800',
          _hover: {
            bg: 'whiteAlpha.100',
            color: 'white',
          },
        },
      },
    },
    Card: {
      variants: {
        elevated: {
          container: {
            bg: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            border: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            bg: 'rgba(255, 255, 255, 0.05)',
            _hover: {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            _focus: {
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px brand.500',
            },
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: 'rgba(26, 32, 44, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
      },
    },
  },
});

export default premiumTheme;