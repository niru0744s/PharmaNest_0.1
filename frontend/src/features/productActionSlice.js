import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from '../axiosInstance';

// ================= CART =================

// Add to Cart
export const addToCart = createAsyncThunk(
  "productActions/addToCart",
  async (product) => {
    const res = await axiosInstance.post("/api/cart", product);
    return res.data;
  }
);

// Update Cart (e.g., quantity)
export const updateCart = createAsyncThunk(
  "productActions/updateCart",
  async ({ productId, quantity }) => {
    const res = await axiosInstance.put(`/api/cart/${productId}`, { quantity });
    return res.data;
  }
);

// Fetch Cart Products
export const fetchCartProducts = createAsyncThunk(
  "productActions/fetchCart",
  async () => {
    const res = await axiosInstance.get("/api/cart");
    return res.data;
  }
);

// ================= WISHLIST =================

// Add to Wishlist
export const addToWishlist = createAsyncThunk(
  "productActions/addToWishlist",
  async (productId) => {
    await axiosInstance.post("/api/wishlist", { productId });
    return productId;
  }
);

// Toggle Wishlist (remove)
export const updateWishlist = createAsyncThunk(
  "productActions/updateWishlist",
  async (productId) => {
    await axiosInstance.put(`/api/wishlist/${productId}`);
    return productId;
  }
);

// Fetch Wishlist
export const fetchWishlist = createAsyncThunk(
  "productActions/fetchWishlist",
  async () => {
    const res = await axiosInstance.get("/api/wishlist");
    return res.data;
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
        const exists = state.cart.find((item) => item._id === action.payload._id);
        if (!exists) {
          state.cart.push(action.payload);
        }
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        const idx = state.cart.findIndex((item) => item._id === action.payload._id);
        if (idx !== -1) {
          state.cart[idx] = action.payload;
        }
      })
      .addCase(fetchCartProducts.fulfilled, (state, action) => {
        state.cart = action.payload;
      })

      // === Wishlist ===
      .addCase(addToWishlist.fulfilled, (state, action) => {
        if (!state.wishlist.includes(action.payload)) {
          state.wishlist.push(action.payload);
        }
      })
      .addCase(updateWishlist.fulfilled, (state, action) => {
        state.wishlist = state.wishlist.filter((id) => id !== action.payload);
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
