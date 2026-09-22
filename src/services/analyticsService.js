import api from './api';

const analyticsService = {
  getDashboardStats: () => api.get('/analytics/dashboard').then((res) => res.data),
};

export default analyticsService;