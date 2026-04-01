import axios from 'axios';

// 🌐 Base URL: use env variable or fallback to localhost for dev
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// 🧩 Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ⚙️ Request Interceptor — attach token if presents
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ⚠️ Response Interceptor — handle auth + errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Session expired or unauthorized — logging out.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// 🧱 Helper: FormData Builder
const buildFormData = (data = {}, files = {}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => formData.append(key, value));
  Object.entries(files).forEach(([name, file]) => formData.append(name, file));
  return formData;
};

// 🔐 Auth API
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }).then((res) => res.data),

  register: (userData) =>
    api.post('/auth/register', userData).then((res) => res.data),

  getProfile: () =>
    api.get('/auth/profile').then((res) => res.data),

  updateProfile: (data) =>
    api.put('/auth/profile', data).then((res) => res.data),
  changePassword: (data) => 
    api.put('/auth/change-password', data).then((res) => res.data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data).then(r => r.data),
  resetPassword: (token, data) => api.put(`/auth/reset-password/${token}`, data).then(r => r.data),
  verifyEmail: (token) => api.get(`/auth/verify/${token}`).then(r => r.data),
};

// 🎟️ Events API
export const eventsAPI = {
  getAll: (params = {}) =>
    api.get('/events', { params }).then((res) => res.data),

  getById: (id) =>
    api.get(`/events/${id}`).then((res) => res.data),

  create: (eventData, imageFile = null) => {
    const config = imageFile
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const body = imageFile
      ? buildFormData(eventData, { image: imageFile })
      : eventData;
    return api.post('/events', body, config).then((res) => res.data);
  },

  update: (id, eventData, imageFile = null) => {
    const config = imageFile
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const body = imageFile
      ? buildFormData(eventData, { image: imageFile })
      : eventData;
    return api.put(`/events/${id}`, body, config).then((res) => res.data);
  },

  delete: (id) =>
    api.delete(`/events/${id}`).then((res) => res.data),

  search: (query) =>
    api.get('/events/search', { params: { q: query } }).then((res) => res.data),

  saveEvent: (eventId) =>
    api.post(`/events/${eventId}/save`).then((res) => res.data),

  unsaveEvent: (eventId) =>
    api.delete(`/events/${eventId}/save`).then((res) => res.data),
};

// 📋 Registrations API
export const registrationsAPI = {
  register: (eventId) =>
    api.post(`/registrations/${eventId}`).then((res) => res.data),

  unregister: (eventId) =>
    api.delete(`/registrations/${eventId}`).then((res) => res.data),

  checkRegistration: (eventId) =>
    api.get(`/registrations/check/${eventId}`).then((res) => res.data),

  getMyRegistrations: () =>
    api.get('/registrations/my').then((res) => res.data),

  getEventAttendees: (eventId) =>
    api.get(`/registrations/event/${eventId}`).then((res) => res.data),
};

export const categoryAPI = {
  getAll: async () => {
    const res = await api.get('/categories');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/categories', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/categories/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  }
};

export const adminAPI = {
  approveEvent: async (id) => {
    const res = await api.put(`/events/${id}/approve`);
    return res.data;
  },
  rejectEvent: async (id) => {
    const res = await api.put(`/events/${id}/reject`);
    return res.data;
  }
};

export default api;
