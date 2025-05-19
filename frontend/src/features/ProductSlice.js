import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';

export const submitProduct = createAsyncThunk(
  'product/submitProduct',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/addProduct', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(res);
      if (res.data.success === 1) return res.data;
      return rejectWithValue(res.data.message || 'Unknown error');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const showProduct = createAsyncThunk(
  'product/showProduct',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/showProducts');
      console.log(res);
      if (res.data.success == 1) {
        toast.success(res.data.message);
        return res.data.products;
      } else if (res.data.success == 2) {
        toast.warning(res.data.message);
      }
      else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message);
      return rejectWithValue(err.response?.data || 'Server error');
    }
  }
)

export const editProduct = createAsyncThunk(
  'product/editproduct',
  async ({ payload, id }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/updateProduct`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: {
          id: id
        }
      });
      if (res.data.success == 1) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message);
      return rejectWithValue(err.response?.data || 'Server error');
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete('/deleteProduct', {
        params: {
          id
        }
      });
      if (res.data.success == 1) {
        toast.success(res.data.message);
        return id;
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message);
      return rejectWithValue(err.response?.data || 'Server error');
    }
  }
)

const productSlice = createSlice({
  name: 'product',
  initialState: {
    loading: false,
    error: null,
    success: false,
    products: []
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
      })
      .addCase(showProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(showProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.success = true;
      })
      .addCase(showProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        const deletedId = action.payload;
        state.products = state.products
          .map(group => ({
            ...group,
            products: group.products.filter(product => product._id !== deletedId)
          }))
          .filter(group => group.products.length > 0);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default productSlice.reducer;
