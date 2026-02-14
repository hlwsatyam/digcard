import axios from 'axios';

const API_URL = axios.defaults.baseURL 

export const uploadImages = (formData) => {
  return axios.post(`${API_URL}/upload/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => res.data);
};

export const uploadSingleImage = (formData) => {
  return axios.post(`${API_URL}/upload/single`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => res.data);
};

// Helper function to get full image URL
export const getImageUrl = (path) => {
  if (!path) return '';
  
  // If it's already a full URL (for development), return as is
  if (path.startsWith('http')) return path;
  
  // If it's a local path, prepend with API URL
  const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') ||axios.defaults.baseURL;
  return `${baseUrl}${path}`;
};