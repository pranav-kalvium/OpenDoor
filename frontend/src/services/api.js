// services/api.js
import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend URL
});

// Add token to requests automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Event-related API calls
export const eventAPI = {
  // Get all events
  getAllEvents: () => API.get('/events'),
  
  // Get single event
  getEvent: (id) => API.get(`/events/${id}`),
  
  // Create event (for later)
  createEvent: (eventData) => API.post('/events', eventData),
};

// Auth-related API calls
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/signup', userData),
};

export default API;