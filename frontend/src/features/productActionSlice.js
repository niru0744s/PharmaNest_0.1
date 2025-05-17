import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from '../axiosInstance';
import { toast } from "react-toastify";

// ================= CART =================

// Add to Cart
export const addToCart = createAsyncThunk(
  "productActions/addToCart",
  async (product) => {
    try {
      const res = await axiosInstance.post(`/user/addCart/${product.productId}`);
      console.log(res);
      if(res.data.success == 1){
        toast.success(res.data.message);
        return res.data.existingCart;
      }else{
        console.log(res.data.message);
      }
      } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message || 'Server error');
      }
  }
);

// Update Cart (e.g., quantity)
export const updateCart = createAsyncThunk(
  "productActions/updateCart",
  async ({ productId, quantity }) => {
    const res = await axiosInstance.put(`/user/updateCart/${productId}`, { quantity });
    return productId;
  }
);

// Fetch Cart Products
export const fetchCartProducts = createAsyncThunk(
  "productActions/fetchCart",
  async () => {
    const res = await axiosInstance.get("/user/fetchCart");
    if(res.data.success == 1){
      console.log(res.data.userCart)
      return res.data.userCart;
    }else{
      console.log(res.data.message);
    }
  }
);

// ================= WISHLIST =================

// Add to Wishlist
export const addToWishlist = createAsyncThunk(
  "productActions/addToWishlist",
  async (productId, { rejectWithValue }) => {
    console.log(productId);
    try {
      const res = await axiosInstance.post(`/user/addWishlist/${productId.productId}`);
      if (res.data.success == 1) {
        toast.success(res.data.message);
        return res.data.wishlist;
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message || 'Server error');
    }
  }
);

// Toggle Wishlist (remove)
export const updateWishlist = createAsyncThunk(
  "productActions/updateWishlist",
  async (productId, { rejectWithValue }) => {
    console.log(productId);
    try {
      const res = await axiosInstance.delete(`/user/deleteWishlist/${productId.productId}`);
      console.log(res);
      if (res.data.success == 1) {
        toast.success(res.data.message);
        return productId.productId;
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message || 'Server error');
    }
  }
);

// Fetch Wishlist
export const fetchWishlist = createAsyncThunk(
  "productActions/fetchWishlist",
  async () => {
    try {
      const res = await axiosInstance.get("/user/fetchWishlist");
    if(res.data.success == 1){
      return res.data.wishlist;
    }else{
      console.log(res.data.message);
    }
    } catch (error) {
      toast.error(error);
    }
  }
);

// ================= PURCHASE =================

// Purchase Product
export const purchaseProduct = createAsyncThunk(
  "productActions/purchaseProduct",
  async (purchaseData) => {
    const res = await axiosInstance.post("/api/purchase", purchaseData);
    return res.data;
  }
);

// Fetch Purchased Products
export const fetchPurchasedProducts = createAsyncThunk(
  "productActions/fetchPurchasedProducts",
  async () => {
    const res = await axiosInstance.get("/api/purchase");
    return res.data;
  }
);

// Cancel Purchased Product
export const cancelPurchaseProduct = createAsyncThunk(
  "productActions/cancelPurchaseProduct",
  async (purchaseId) => {
    await axiosInstance.delete(`/api/purchase/${purchaseId}`);
    return purchaseId;
  }
);

// ================= SLICE =================

const productActionsSlice = createSlice({
  name: "productActions",
  initialState: {
    cart: [],
    wishlist: [],
    purchases: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // === Cart ===
      .addCase(addToCart.fulfilled, (state, action) => {
        const product = action.payload;
        const exists = state.cart.find(item => item._id === product.products);
        if(!exists){
          state.cart.push(product);
        }
        state.loading = false ;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        const productId = action.payload.productId;
        state.cart = state.cart.filter(item => item._id !== productId);
        state.loading = false;
      })
      .addCase(fetchCartProducts.fulfilled, (state, action) => {
        state.cart = action.payload;
      })

      // === Wishlist ===
      .addCase(addToWishlist.fulfilled, (state, action) => {
        const product = action.payload;
        const exists = state.wishlist.find(item => item._id === product._id);
        if (!exists) {
        state.wishlist.push(product);
        }
        state.loading = false;
      })
      .addCase(updateWishlist.fulfilled, (state, action) => {
        const productId = action.payload.productId;
        state.wishlist = state.wishlist.filter(item => item._id !== productId);
        state.loading = false;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
      })

      // === Purchase ===
      .addCase(purchaseProduct.fulfilled, (state, action) => {
        state.purchases.push(action.payload);
        // optionally remove from cart if same product
        state.cart = state.cart.filter((item) => item._id !== action.payload.productId);
      })
      .addCase(fetchPurchasedProducts.fulfilled, (state, action) => {
        state.purchases = action.payload;
      })
      .addCase(cancelPurchaseProduct.fulfilled, (state, action) => {
        state.purchases = state.purchases.filter((p) => p._id !== action.payload);
      })

      // === Common loading and error ===
      .addMatcher((action) => action.type.endsWith("/pending"), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled") || action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          if (action.type.endsWith("/rejected")) {
            state.error = action.error.message;
          }
        }
      );
  },
});

export default productActionsSlice.reducer;
