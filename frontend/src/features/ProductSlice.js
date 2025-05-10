// redux/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const submitProduct = createAsyncThunk(
  'product/submitProduct',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success === 1) return res.data;
      return rejectWithValue(res.data.message || 'Unknown error');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    loading: false,
    error: null,
    success: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
