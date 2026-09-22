import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bayService from '../../services/bayService';

export const fetchBays = createAsyncThunk('bays/fetchAll', async () => {
  return await bayService.getAll();
});

const baySlice = createSlice({
  name: 'bays',
  initialState: { items: [], loading: false, error: null, searchQuery: '' },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBays.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBays.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSearchQuery } = baySlice.actions;
export default baySlice.reducer;