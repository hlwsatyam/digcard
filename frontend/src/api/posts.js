import axiosInstance from './axios';

export const getPosts = (params = {}) => {
  return axiosInstance.get('/posts', { params });
};

export const getPostById = (id) => {
  return axiosInstance.get(`/posts/${id}`);
};

export const createPost = (data) => {
  return axiosInstance.post('/posts', data);
};

export const getMyPosts = () => {
  return axiosInstance.get('/posts/my-posts');
};

export const deletePost = (id) => {
  return axiosInstance.delete(`/posts/${id}`);
};

export const updatePost = (id, data) => {
  return axiosInstance.put(`/posts/${id}`, data);
};