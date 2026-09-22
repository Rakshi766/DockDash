import api from './api';

const activityService = {
  logActivity: (data) => api.post('/activities', data).then((res) => res.data),
  getLogs: (appointmentId) =>
    api.get(`/activities/appointment/${appointmentId}`).then((res) => res.data),
  approveLog: (logId) => api.put(`/activities/${logId}/approve`).then((res) => res.data),
};

export default activityService;