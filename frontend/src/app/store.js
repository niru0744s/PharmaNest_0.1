import {configureStore} from '@reduxjs/toolkit';
import signupReducer from '../features/signupSlice';
import loginReducer from '../features/loginSlice';
export const store = configureStore({
    reducer :{
        signup:signupReducer,
        login: loginReducer,
    }
});