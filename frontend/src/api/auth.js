import axiosInstance from './axios';

export const googleLogin = (token) => {
  return axiosInstance.post('/auth/google', { token });
};

// Development only - remove mock login for production
// export const mockLogin = () => {
//   return axiosInstance.post('/auth/mock-login');
// };