// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export const loginHost = createAsyncThunk(
    'auth/loginHost',
    async (data, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/host/auth/login`, data);
            console.log(res);
            if(res.data.success === 1){
              const host = res.data.updatedUsr;
              const token = res.data.token;
              toast.success(res.data.message);
              localStorage.setItem('token',token);
              localStorage.setItem("host", JSON.stringify(res.data.updatedUsr));
              return {host};
            }else{
              toast.error(res.data.message);
              return rejectWithValue(res.data.message);
            }
        } catch (err) {
            toast.error('Login failed');
            return rejectWithValue(err.response?.data || 'Something went wrong');
        }
    }
);

const authSlice = createSlice({
  name: 'hostAuth',
  initialState: {
    token: localStorage.getItem("token") || null,
    host: localStorage.getItem("host")||null,
    status: 'idle',
    isHostAuthenticated:false,
    error: null,
  },
  reducers: {
    hostLogout: (state) =>{
      state.token = null;
            state.user = null;
            state.isHostAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('host');
    },
    setHostTokenFromStorage: (state,action)=>{
      state.token = action.payload;
      state.isHostAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginHost.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginHost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.host = action.payload;
        state.isHostAuthenticated = true;
      })
      .addCase(loginHost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {hostLogout , setHostTokenFromStorage} = authSlice.actions;
export default authSlice.reducer;
