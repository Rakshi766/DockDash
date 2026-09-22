import api from './api';

const appointmentService = {
  getAll: () => api.get('/appointments').then((res) => res.data),

  book: (data) =>
    api.post('/appointments/book', data).then((res) => res.data),

  checkIn: (id) =>
    api.put(`/appointments/${id}/check-in`).then((res) => res.data),

  complete: (id) =>
    api.put(`/appointments/${id}/complete`).then((res) => res.data),
};

export default appointmentService;