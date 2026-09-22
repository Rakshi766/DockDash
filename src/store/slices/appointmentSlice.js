import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import appointmentService from '../../services/appointmentService';

export const fetchAppointments = createAsyncThunk('appointments/fetchAll', async () => {
  return await appointmentService.getAll();
});

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: { items: [], loading: false, error: null, filterStatus: 'ALL' },
  reducers: {
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilterStatus } = appointmentSlice.actions;
export default appointmentSlice.reducer;