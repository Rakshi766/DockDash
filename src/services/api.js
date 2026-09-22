import axios from 'axios';

const api = axios;

if (api.defaults) {
  api.defaults.baseURL = 'http://localhost:8080/api';
}

if (api.interceptors?.request?.use) {
  api.interceptors.request.use((config) => {
    const userStr = localStorage.getItem('user');

    if (userStr) {
      try {
        const user = JSON.parse(userStr);

        if (user.token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch {
        localStorage.removeItem('user');
      }
    }

    return config;
  });
}

if (api.interceptors?.response?.use) {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('user');
      }

      return Promise.reject(error);
    }
  );
}

export default api;