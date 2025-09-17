// App.jsx
import React from 'react';
import { ChakraProvider, CSSReset, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import premiumTheme from './theme/premiumTheme';
import PremiumLayout from './components/PremiumLayout';
import PremiumNavbar from './components/PremiumNavbar';
import Home from './pages/Home';
import MapView from './pages/MapView';
import ListView from './pages/ListView';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About'; // Add this
import Profile from './pages/Profile'; // Add this

function App() {
  return (
    <ChakraProvider theme={premiumTheme}>
      <CSSReset />
      <AuthProvider>
        <Router>
          <PremiumLayout>
            <PremiumNavbar />
            <Box pt="70px"> {/* Reduced padding for better alignment */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/map" element={<MapView />} />
                <Route path="/list" element={<ListView />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Box>
          </PremiumLayout>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;