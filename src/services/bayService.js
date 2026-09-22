import api from './api';

const bayService = {
  getAll: () => api.get('/bays').then((res) => res.data),
  create: (bayData) => api.post('/bays', bayData).then((res) => res.data),
  updateStatus: (id, status) =>
    api.put(`/bays/${id}/maintenance?status=${status}`).then((res) => res.data),
  updateWeight: (id, weight) => api.patch(`/bays/${id}/weight`, weight).then((res) => res.data),
};

export default bayService;