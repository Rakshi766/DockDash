import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import shipmentService from '../../services/shipmentService';

export const fetchShipments = createAsyncThunk('shipments/fetchAll', async () => {
  return await shipmentService.getAll();
});

const shipmentSlice = createSlice({
  name: 'shipments',
  initialState: { items: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShipments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShipments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchShipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default shipmentSlice.reducer;