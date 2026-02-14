import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: axios.defaults.baseURL,  
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear localStorage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (userData) => api.put('/api/auth/profile', userData),
  changePassword: (passwords) => api.put('/api/auth/change-password', passwords),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/api/auth/reset-password', data),
};

// Enquiry API calls
export const enquiryAPI = {
  createEnquiry: (formData) => api.post('/api/enquiries', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getAllEnquiries: () => api.get('/api/enquiries'),
  generateCredentials: (enquiryId) => api.post(`/api/enquiries/${enquiryId}/generate-credentials`),
};

// Donation API calls
export const donationAPI = {
  createDonation: (donationData) => api.post('/api/donations/donate', donationData),
  getMemberDonations: () => api.get('/api/donations/member'),
  getAllDonations: () => api.get('/api/donations'),
  getDonationStats: () => api.get('/api/donations/stats'),
  updateDonationStatus: (donationId, status) => 
    api.put(`/api/donations/${donationId}/status`, { status }),
};

// User API calls
export const userAPI = {
  getAllUsers: () => api.get('/api/users'),
  updateUser: (userId, data) => api.put(`/api/users/${userId}`, data),
  deleteUser: (userId) => api.delete(`/api/users/${userId}`),
};

export default api;