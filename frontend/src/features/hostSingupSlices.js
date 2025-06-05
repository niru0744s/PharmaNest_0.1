import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export const submitOtp = createAsyncThunk(
  'HostSignup/submitOtp',
  async (data, { rejectWithValue }) => {
    console.log("user email -",data);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/host/auth/otpSent`, data);
      if(res.data.success == 1){
        toast.success(res.data.message);
        return res.data.newUSr;
      }else{
        toast.error(res.data.message);
        return rejectWithValue(res.data.message);
      }
    } catch (err) {
      console.log(err)
      toast.error("Something went wrong!");
      return rejectWithValue(err.response.data || 'OTP failed');
    }
  }
);

export const HostOtpVerify = createAsyncThunk(
  'HostSignup/VerifyOtp',
  async (data, { rejectWithValue }) => {
    console.log(data);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/host/auth/otpVerify`, data ,{
        params:{
          id:data.id
        }
      });
      console.log(res);
      if(res.data.success == 1){
        toast.success(res.data.message);
        return res.data;
      }else{
        toast.error(res.data.message);
        return rejectWithValue(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
      return rejectWithValue(err.response.data || 'Failed');
    }
  }
);

export const finalSubmit = createAsyncThunk(
  'HostSignup/finalSubmit',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/host/auth/createPass`, data.formData ,{
        params:{
          id:data.id
        }
      });
      console.log(res);
      if(res.data.success == 1){
        toast.success(res.data.message);
        localStorage.setItem('host',JSON.stringify(res.data.updatedUsr))
        return res.data.newUser;
      }else{
        toast.error(res.data.message);
        return rejectWithValue(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
      return rejectWithValue(err.response.data || 'Final step failed');
    }
  }
);

const hostSingupSlice = createSlice({
    name: 'hostSingup',
    initialState: {
        step:1 ,
        loading: false ,
        error: null,
        hostData : null,
        host : null ,
        isAuthenticated : false
    },
    reducers: {
        resetHostSignup : (state) =>{
            state.step = 1;
            state.error = null;
        },
    },

extraReducers : (builder) =>{
    builder
    .addCase(HostOtpVerify.pending, (state)=>{
        state.loading = true;
    })
    .addCase(HostOtpVerify.fulfilled, (state , action)=>{
        state.loading = false;
        state.step = 2;
    })
    .addCase(HostOtpVerify.rejected, (state , action)=>{
        state.loading = false;
        state.error = action.payload;
    })
    .addCase(submitOtp.pending, (state)=>{
        state.loading = true;
    })
    .addCase(submitOtp.fulfilled,(state , action)=>{
        state.loading = false;
        state.step = 3;
        state.hostData = action.payload;
    })
    .addCase(submitOtp.rejected, (state,action)=>{
        state.loading = false;
        state.action = action.payload;
    })
    .addCase(finalSubmit.pending, (state)=>{
        state.loading = true;
    })
    .addCase(finalSubmit.fulfilled ,(state, action)=>{
         state.step = 4; 
        state.user = action.payload;
        state.isAuthenticated = true;
    })
    .addCase(finalSubmit.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    })
},
});

export const {resetHostSignup} = hostSingupSlice.actions;
export default hostSingupSlice.reducer;