import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance';

export const fetchProductsByCategory = createAsyncThunk(
  'data/fetchProductsByCategory',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/products');
      if(res.data.success == 1){
        console.log(res.data.categoryWise);
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

export const fetchAddress = createAsyncThunk(
  'data/fetchAddress',
  async(_,{rejectWithValue}) =>{
    try {
      const res = await axiosInstance.get('/address/fetchAddress');
      console.log(res.data);
      if(res.data.success == 1){
        return res.data.allAddress;
      }else if(res.data.success == 2){
        return res.data.allAddress;
      }
      else{
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('Failed to load products');
      return rejectWithValue(err.response?.data || 'Server error');
    }
  }
)

export const addAddress = createAsyncThunk(
  'data/addAddress',
  async(data,{rejectWithValue}) =>{
    console.log(data);
    try {
      const res = await axiosInstance.post(`/address/addAddress`,data);
      console.log(res);
      if(res.data.success == 1){
        toast.success(res.data.message);
        return res.data.newAddress;
      }else{
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('Failed to load products');
      return rejectWithValue(err.response?.data || 'Server error');
    }
  }
)

export const deleteAddress = createAsyncThunk(
  'data/deleteAddress',
  async(addressId,{rejectWithValue}) =>{
    try {
      const res = await axiosInstance.delete(`/address/deleteAddress/${addressId}`);
      console.log(res);
      if(res.data.success == 1){
        toast.success(res.data.message);
        return addressId;
      }else{
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('Failed to load products');
      return rejectWithValue(err.response?.data || 'Server error');
    }
  }
)

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    categories: [],
    address:[],
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
      })
      .addCase(fetchAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.address = action.payload;
        console.log(state.address);
        state.loading = false;
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        const address = action.payload;
        const exist = state.address.find(item => item._id == address._id);
        if(!exist){
          state.address.push(address);
        }
          state.loading = false;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        const addressId = action.payload;
        state.address = state.address.filter(item => item._id !== addressId);
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default dataSlice.reducer;
