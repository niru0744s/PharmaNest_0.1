import {configureStore} from '@reduxjs/toolkit';
import signupReducer from '../features/signupSlice';
import loginReducer from '../features/loginSlice';
import dataReducer from '../features/dataSlice';
import productSlice from '../features/ProductSlice';
import aiAdvisorReducer from '../features/aiAdvisorSlice';
import hostAuthReducer from '../features/hostLoginSlices';
import hostSignupReducer from '../features/hostSingupSlices';
import productActionReducer from "../features/productActionSlice";

export const store = configureStore({
    reducer :{
        signup:signupReducer,
        login: loginReducer,
        data:dataReducer,
        product:productSlice,
        aiAdvisor:aiAdvisorReducer,
        loginHost:hostAuthReducer,
        signupHost:hostSignupReducer,
        productActions:productActionReducer
    }
});