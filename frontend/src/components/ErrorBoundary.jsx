import React from 'react';
import { Box, Heading, Text, Button, Container } from '@chakra-ui/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxW="container.md" py={12}>
          <Box textAlign="center" py={10}>
            <Heading size="xl" mb={4} color="red.500">
              Something went wrong
            </Heading>
            <Text fontSize="lg" color="gray.600" mb={6}>
              We're sorry, but something went wrong. Please try refreshing the page.
            </Text>
            
            {process.env.NODE_ENV === 'development' && (
              <Box 
                bg="gray.100" 
                p={4} 
                borderRadius="md" 
                textAlign="left" 
                mb={6}
                maxH="200px"
                overflowY="auto"
              >
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                  Error Details:
                </Text>
                <Text fontSize="xs" fontFamily="monospace">
                  {this.state.error && this.state.error.toString()}
                </Text>
                <Text fontSize="xs" fontFamily="monospace" mt={2}>
                  {this.state.errorInfo?.componentStack}
                </Text>
              </Box>
            )}
            
            <Button
              colorScheme="blue"
              onClick={() => window.location.reload()}
              size="lg"
            >
              Refresh Page
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;