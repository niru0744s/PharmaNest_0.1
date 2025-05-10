import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export const fetchProductsByCategory = createAsyncThunk(
  'data/fetchProductsByCategory',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/products');
      if(res.data.success == 1){
        console.log("fetch",res.data.categoryWise)
        return res.data.categoryWise;
      }else{
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to load products');
      return rejectWithValue(err.response?.data || 'Server error');
    }
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dataSlice.reducer;
