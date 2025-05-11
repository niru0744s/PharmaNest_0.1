import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';


export const submitCredentials = createAsyncThunk(
  'signup/submitCredentials',
  async (data, { rejectWithValue }) => {
    console.log(data);
    try {
      const res = await axios.post('http://localhost:8080/api/v1/user/auth/otpVerify', data ,{
        params:{
          id:data.id
        }
      });
      console.log(res.data.success);
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

export const submitOtp = createAsyncThunk(
  'signup/submitOtp',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post('http://localhost:8080/api/v1/user/auth/otpSent', data);
      if(res.data.success == 1){
        toast.success(res.data.message);
        return res.data;
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

export const finalSubmit = createAsyncThunk(
  'signup/finalSubmit',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post('http://localhost:8080/api/v1/user/auth/createPass', data.formData ,{
        params:{
          id:data.id
        }
      });
      console.log(res);
      if(res.data.success == 1){
        toast.success(res.data.message);
        localStorage.setItem('user',JSON.stringify(res.data.newUser))
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

const signupSlice = createSlice({
  name: 'signup',
  initialState: {
    step: 1,
    loading: false,
    error: null,
    userData: null,
    user: null,
    isAuthenticated : false
  },
  reducers: {
    resetSignup: (state) => {
      state.step = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitCredentials.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitCredentials.fulfilled, (state, action) => {
        state.loading = false;
        state.step = 2;
      })
      .addCase(submitCredentials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.step = 3;
        state.userData = action.payload.newUSr;
      })
      .addCase(submitOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(finalSubmit.fulfilled, (state, action) => {
        state.step = 4; 
        state.user = action.payload;
        state.isAuthenticated = true;
      });
  },
});

export const { resetSignup } = signupSlice.actions;
export default signupSlice.reducer;
