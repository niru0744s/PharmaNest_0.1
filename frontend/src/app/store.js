import {configureStore} from '@reduxjs/toolkit';
export const store = configureStore({
    reducer :{
        cart: createReducer,
        purchase: purchaseReducer,
        products: productsReducer,
    }
});