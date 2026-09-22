import api from './api';

const authService = {
  login: (credentials) => api.post('/auth/login', credentials).then((res) => res.data),
  register: (userData) => api.post('/auth/register', userData).then((res) => res.data),
};

export default authService;