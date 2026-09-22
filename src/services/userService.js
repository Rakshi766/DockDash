import api from './api';

const userService = {
  getCarriers: () => api.get('/users/carriers').then((res) => res.data),
};

export default userService;