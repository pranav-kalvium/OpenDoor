import React, { Suspense, lazy } from 'react';
import { ChakraProvider, Spinner, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import PremiumLayout from './components/PremiumLayout';
import ProtectedRoute from './components/ProtectedRoute';
import premiumTheme from './theme/premiumTheme';

import SplashScreen from './components/SplashScreen';

// Lazy loading for code splitting
const Home = lazy(() => import('./pages/Home'));
const MapView = lazy(() => import('./pages/MapView'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const About = lazy(() => import('./pages/About'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const EventForm = lazy(() => import('./pages/EventForm'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));

const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
    <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
  </Box>
);

function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  return (
    <ChakraProvider theme={premiumTheme}>
      <ErrorBoundary>
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
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
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/verify-email/:token" element={<VerifyEmail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/events/:id" element={<EventDetail />} />
                  <Route
                    path="/events/create"
                    element={
                      <ProtectedRoute allowedRoles={['manager', 'admin']}>
                        <EventForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/events/:id/edit"
                    element={
                      <ProtectedRoute allowedRoles={['manager', 'admin']}>
                        <EventForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={['manager', 'admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
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

