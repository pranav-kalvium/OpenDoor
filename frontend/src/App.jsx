import React, { Suspense, lazy } from 'react';
import { ChakraProvider, Spinner, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import PremiumLayout from './components/PremiumLayout';
import premiumTheme from './theme/premiumTheme';

// Lazy loading for code splitting
const Home = lazy(() => import('./pages/Home'));
const MapView = lazy(() => import('./pages/MapView'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const About = lazy(() => import('./pages/About'));

const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
    <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
  </Box>
);

function App() {
  return (
    <ChakraProvider theme={premiumTheme}>
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <PremiumLayout>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/map" element={<MapView />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/about" element={<About />} />
                </Routes>
              </Suspense>
            </PremiumLayout>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </ChakraProvider>
  );
}

export default App;