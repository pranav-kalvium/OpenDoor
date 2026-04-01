import { extendTheme } from '@chakra-ui/react';

const premiumTheme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981', // Emerald green
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    alliance: {
      primary: '#10b981', // Changed from blue to emerald green
      secondary: '#059669', // Darker emerald instead of red
      dark: '#1A202C', // Dark gray/navy replacement for anything needing a dark contrasting bg
      gold: '#FBBF24', // Keeping for subtle highlights if needed, but no blue/purple
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
    heading: '"Outfit", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  styles: {
    global: {
      'html, body': {
        bg: '#F0FDF4', // Light mint/white background
        backgroundAttachment: 'fixed',
        color: 'gray.800',
        minHeight: '100vh',
        fontFeatureSettings: '"ss01", "ss02", "cv01", "cv02"',
        scrollBehavior: 'smooth',
      },
      '*::placeholder': {
        color: 'gray.400',
      },
      '*, *::before, &::after': {
        borderColor: 'gray.200',
      },
      '.glass-card': {
        background: '#FFFFFF',
        border: '1px solid',
        borderColor: 'gray.100',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      },
      '.glass-navbar': {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid',
        borderColor: 'gray.100',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
      },
    },
  },
  components: {
    Button: {
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          },
          _active: {
            bg: 'brand.700',
          },
        },
        outline: {
          border: '2px solid',
          borderColor: 'brand.500',
          color: 'brand.600',
          _hover: {
            bg: 'brand.50',
          },
        },
        ghost: {
          color: 'gray.600',
          _hover: {
            bg: 'gray.50',
            color: 'brand.600',
          },
        },
      },
    },
    Card: {
      variants: {
        elevated: {
          container: {
            bg: '#FFFFFF',
            border: '1px solid',
            borderColor: 'gray.100',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            border: '1px solid',
            borderColor: 'gray.200',
            bg: '#FFFFFF',
            color: 'gray.800',
            _hover: {
              borderColor: 'brand.300',
            },
            _focus: {
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px #10b981',
            },
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: '#FFFFFF',
          border: '1px solid',
          borderColor: 'gray.100',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default premiumTheme;