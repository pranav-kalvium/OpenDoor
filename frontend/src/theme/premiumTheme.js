// theme/premiumTheme.js
import { extendTheme } from '@chakra-ui/react';

const premiumTheme = extendTheme({
  colors: {
    premium: {
      dark: '#0F0F1E',
      darker: '#080814',
      primary: '#6366F1',
      primaryLight: '#818CF8',
      secondary: '#06B6D4',
      accent: '#F59E0B',
      surface: '#1E1E2E',
      surfaceLight: '#2A2A3A',
      text: {
        primary: '#F8FAFC',
        secondary: '#94A3B8',
        muted: '#64748B'
      }
    }
  },
  fonts: {
    heading: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    body: '"Inter", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
  },
  styles: {
    global: {
      'html, body': {
        bg: 'premium.dark',
        color: 'premium.text.primary',
        fontFeatureSettings: '"ss01", "ss02", "cv01", "cv02"',
        scrollBehavior: 'smooth'
      },
      '*::selection': {
        bg: 'premium.primary',
        color: 'white'
      }
    }
  },
  components: {
    Button: {
      variants: {
        premium: {
          bg: 'linear-gradient(135deg, premium.primary 0%, premium.secondary 100%)',
          color: 'white',
          fontWeight: '600',
          borderRadius: 'xl',
          px: 8,
          py: 6,
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)',
            _before: {
              opacity: 1
            }
          },
          _active: {
            transform: 'translateY(0)'
          },
          transition: 'all 0.3s ease-in-out'
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'premium.text.primary',
          _hover: {
            bg: 'rgba(255, 255, 255, 0.15)',
            transform: 'translateY(-2px)'
          }
        }
      }
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'premium.surface',
          border: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '2xl',
          backdropFilter: 'blur(20px)'
        }
      }
    }
  }
});

export default premiumTheme;