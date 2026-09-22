import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import bayReducer from './slices/baySlice';
import shipmentReducer from './slices/shipmentSlice';
import appointmentReducer from './slices/appointmentSlice';

export const setupStore = (preloadedState) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      bays: bayReducer,
      shipments: shipmentReducer,
      appointments: appointmentReducer,
    },
    preloadedState,
  });
};

const store = setupStore();

export default store;