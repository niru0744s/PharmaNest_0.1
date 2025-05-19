import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from '../axiosInstance';
import { toast } from "react-toastify";

// ================= CART =================

// Add to Cart
export const addToCart = createAsyncThunk(
  "productActions/addToCart",
  async ({productId}) => {
    try {
      const res = await axiosInstance.post(`/user/addCart/${productId}`);
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
    try {
      const res = await axiosInstance.patch(`/user/updateCart/${productId}`, { quantity });
    if(res.data.success == 1){
      toast.success(res.data.message);
      return {productId , quantity};
    }else{
      toast.error(res.data.message);
    }
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message || 'Server error');
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "productActions/deletecart",
  async ( productId) => {
    try {
      const res = await axiosInstance.delete(`/user/deletecart/${productId}`);
    if(res.data.success == 1){
      toast.success(res.data.message);
      return productId;
    }else{
      toast.error(res.data.message);
    }
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message || 'Server error');
    }
  }
)

// Fetch Cart Products
export const fetchCartProducts = createAsyncThunk(
  "productActions/fetchCart",
  async () => {
    const res = await axiosInstance.get("/user/fetchCart");
    console.log(res.data.userCart);
    if(res.data.success == 1){
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
    try {
      const res = await axiosInstance.delete(`/user/deleteWishlist/${productId.productId}`);
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
      console.log("wishlist",res.data.wishlist);
    if(res.data.success == 1){
      return res.data.wishlist;
    }else{
      console.log(res.data.message);
      return res.data.wishlist;
    }
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message || 'Server error');
    }
  }
);

// ================= PURCHASE =================

// Purchase Product
export const purchaseProduct = createAsyncThunk(
  "productActions/purchaseProduct",
  async ({finalPrice , cartItemsId}) => {
    try {
    const res = await axiosInstance.post("/user/placeOrder",{finalPrice , cartItemsId});
    if(res.data.success == 1){
      toast.success(res.data.message);
    }else{
      toast.error(res.data.message);
    }
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message || 'Server error');
    }
  }
);

// Fetch Purchased Products
export const fetchPurchasedProducts = createAsyncThunk(
  "productActions/fetchPurchasedProducts",
  async () => {
    try {
      const res = await axiosInstance.get("/user/fetchOrders");
      console.log(res.data.allOrders);
      if(res.data.success == 1){
        return res.data.allOrders;
      }
    } catch (error) {
      toast.error(error);
    }
  }
);

// Cancel Purchased Product
export const cancelOrder = createAsyncThunk(
  "productActions/cancelOrder",
  async (orderId, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/user/cancelOrder/${orderId}`);
      if(res.data.success == 1){
        toast.success(res.data.message);
        return { orderId };
      }else{
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err);
      return thunkAPI.rejectWithValue(err.response.data);
    }
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
        const exists = state.cart.find(item => item._id == product.products._id);
        if(!exists){
          state.cart.push(product);
        }
        state.loading = false ;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        const productId = action.payload.productId;
        const quantity = action.payload.quantity;
        const itemIndex = state.cart.findIndex(item => item._id == productId);
        if(itemIndex !== -1){
          state.cart[itemIndex].quantity = quantity;
        };
        state.loading = false;
      })
      .addCase(deleteCartItem.fulfilled,(state,action)=>{
        const productId = action.payload;
        console.log(state.cart);
        state.cart = state.cart.filter(item => item._id !== productId);
        state.loading = false;
      })
      .addCase(fetchCartProducts.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
      })
      // === Wishlist ===
      .addCase(addToWishlist.fulfilled, (state, action) => {
        const product = action.payload;
        const exists = state.wishlist.find(item => item._id == product._id);
        if (!exists) {
        state.wishlist.push(product);
        }
        state.loading = false;
      })
      .addCase(updateWishlist.fulfilled, (state, action) => {
        const productId = action.payload;
        state.wishlist = state.wishlist.filter(item => item._id !== productId);
        state.loading = false;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
        state.loading = false;
      })

      // === Purchase ===
      .addCase(purchaseProduct.fulfilled, (state, action) => {
        // state.purchases.push(action.payload);
        state.cart = [];
        state.loading = false;
      })
      .addCase(fetchPurchasedProducts.fulfilled, (state, action) => {
        state.purchases = action.payload;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
      const idx = state.purchases.findIndex(o => o._id === action.payload.orderId);
      if (idx !== -1) state.purchases[idx].status = "cancelled";
      })
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
