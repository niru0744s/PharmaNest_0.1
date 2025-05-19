// File: components/Cart/CartDashboard.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Card, CardContent, Typography, Button, Stack, IconButton } from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { updateCart, deleteCartItem , purchaseProduct} from '../../features/productActionSlice';
import axiosInstance from '../../axiosInstance';
import { toast } from 'react-toastify';

const CartDashboard = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.productActions.cart);
  const handleIncrement = (item) => {
    dispatch(updateCart({ productId: item._id, quantity: item.quantity + 1 }));
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch(updateCart({ productId: item._id, quantity: item.quantity - 1 }));
    }
  };

  const handleRemove = async (itemId) => {
    await dispatch(deleteCartItem(itemId)).unwrap();
  };

  const handlePlaceOrder = async () => {
  const cartItemsId = cartItems.map(item => item._id);
  const finalPrice = (totalPrice - 30 - 42);

  // Step 1: Create Razorpay Order from backend
  const res = await axiosInstance.post("/user/create-razorpay-order", { amount: finalPrice * 100 }); // In paise
  const { id: order_id, currency } = res.data;

  // Step 2: Open Razorpay Checkout
  const options = {
    key:"rzp_test_zGATeYxiFoQQLt", // test key
    amount: finalPrice * 100,
    currency,
    name: "PharmaNest",
    description: "Purchase Medicines",
    order_id,
    handler: async function (response) {
      // Razorpay payment succeeded
      toast.success("Payment successful!");

      // Step 3: Place the order in your DB
      await dispatch(purchaseProduct({ finalPrice, cartItemsId })).unwrap();
    },
    prefill: {
      name: "Nirupam",
      email: "test@example.com",
      contact: "9000090000"
    },
    theme: {
      color: "#1976d2"
    }
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};


  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.products?.price || 0) * item.quantity,
    0
  );

  return (
    <Box className="container mt-4">
      <Typography variant="h5" gutterBottom>Cart Summary</Typography>
      <div className="row">
        <div className="col-md-8">
          {cartItems.map((item) => (
            <Card key={item._id} className="mb-3 shadow-sm">
              <div className="row g-0">
                <div className="col-md-3">
                  <img
                    src={item.products?.imageUrl?.url}
                    alt={item.products?.title}
                    className="img-fluid rounded-start"
                    style={{ height: '10rem', objectFit: 'contain' }}
                  />
                </div>
                <div className="col-md-9">
                  <CardContent>
                    <Typography variant="h6">{item.products?.title || 'Product Name'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.products?.description || 'Description'}
                    </Typography>
                    <Typography variant="h6">
                      ₹{item.products?.price.toLocaleString()} × {item.quantity} = ₹
                      {(item.products?.price * item.quantity).toLocaleString()}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center" className="mt-2">
                      <IconButton onClick={() => handleDecrement(item)} disabled={item.quantity === 1} ><Remove /></IconButton>
                      <Typography>{item.quantity}</Typography>
                      <IconButton onClick={() => handleIncrement(item)}  disabled={item.quantity === item.products?.quantity}><Add /></IconButton>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleRemove(item._id)}
                      >
                        Remove
                      </Button>
                    </Stack>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
          {cartItems.length > 0?(
            <div className="col-md-4">
          <Card className="shadow-sm p-3">
            <Typography variant="h6" gutterBottom>PRICE DETAILS</Typography>
            <Typography>Price ({cartItems.length} items): ₹{totalPrice.toLocaleString()}</Typography>
            <Typography>Discount: ₹0</Typography>
            <Typography>Buy more & save more: ₹30</Typography>
            <Typography>Coupons for you: ₹42</Typography>
            <Typography>Delivery Charges: <s>₹100</s> <span className="text-success">Free</span></Typography>
            <hr />
            <Typography variant="h6">
              Total Amount: ₹{(totalPrice - 30 - 42).toLocaleString()}
            </Typography>
            <Typography className="text-success mt-2">
              You will save ₹{(30 + 42).toLocaleString()} on this order
            </Typography>
            <Button variant="contained" color="warning" className="mt-3 w-100" onClick={handlePlaceOrder}>
              Place Order
            </Button>
          </Card>
        </div>
          ):(<><h1 className="text-success mt-2 text-center">You haven't select any cart items yet !</h1></>)}
      </div>
    </Box>
  );
};

export default CartDashboard;
