import axiosInstance from './axios';

export const getUserProfile = () => {
  return axiosInstance.get('/users/profile');
};

export const getMyPosts = () => {
  return axiosInstance.get('/posts/my-posts');
};

export const completeProfile = (data) => {
  return axiosInstance.put('/users/complete-profile', data);
};

export const updateProfile = (data) => {
  return axiosInstance.put('/users/update-profile', data);
};

export const upgradeSubscription = (plan) => {
  return axiosInstance.put('/users/upgrade-subscription', { plan });
};