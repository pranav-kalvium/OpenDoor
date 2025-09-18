import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }).then(res => res.data),
  
  register: (userData) => 
    api.post('/auth/register', userData).then(res => res.data),
  
  getProfile: () => 
    api.get('/auth/profile').then(res => res.data),
};

// Events API
export const eventsAPI = {
  getAll: (params = {}) => 
    api.get('/events', { params }).then(res => res.data),
  
  getById: (id) => 
    api.get(`/events/${id}`).then(res => res.data),
  
  create: (eventData, imageFile = null) => {
    if (imageFile) {
      const formData = new FormData();
      Object.keys(eventData).forEach(key => {
        formData.append(key, eventData[key]);
      });
      formData.append('image', imageFile);
      return api.post('/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(res => res.data);
    } else {
      return api.post('/events', eventData).then(res => res.data);
    }
  },

  update: (id, eventData, imageFile = null) => {
    if (imageFile) {
      const formData = new FormData();
      Object.keys(eventData).forEach(key => {
        formData.append(key, eventData[key]);
      });
      formData.append('image', imageFile);
      return api.put(`/events/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(res => res.data);
    } else {
      return api.put(`/events/${id}`, eventData).then(res => res.data);
    }
  },
  
  delete: (id) => 
    api.delete(`/events/${id}`).then(res => res.data),
  
  search: (query) => 
    api.get('/events/search', { params: { q: query } }).then(res => res.data),
  
  saveEvent: (eventId) => 
    api.post(`/events/${eventId}/save`).then(res => res.data),
  
  unsaveEvent: (eventId) => 
    api.delete(`/events/${eventId}/save`).then(res => res.data),
};

export default api;