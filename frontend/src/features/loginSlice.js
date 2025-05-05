import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (data, { rejectWithValue }) => {
        console.log(data);
        try {
            const res = await axios.post('http://localhost:8080/api/v1/user/auth/login', data);
            console.log(res);
            if (res.data.success === 1) {
                const { token, ...user } = res.data.updatedUsr;
                toast.success(res.data.message);
                localStorage.setItem('token', token);
                return { token, user };
            } else {
                toast.error(res.data.message);
                return rejectWithValue(res.data.message);
            }
        } catch (err) {
            toast.error('Login failed');
            return rejectWithValue(err.response?.data || 'Something went wrong');
        }
    }
);

const loginSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        },
        setTokenFromStorage: (state, action) => {
            state.token = action.payload;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, setTokenFromStorage } = loginSlice.actions;
export default loginSlice.reducer;
