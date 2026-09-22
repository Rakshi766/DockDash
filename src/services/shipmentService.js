import api from './api';

const shipmentService = {
  getAll: (params = {}) => api.get('/shipments', { params }).then((res) => res.data),
  create: (data) => api.post('/shipments', data).then((res) => res.data),
};

export default shipmentService;