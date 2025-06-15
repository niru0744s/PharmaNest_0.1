import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Stack, 
  IconButton,
  Divider,
  Chip,
  Grid
} from '@mui/material';
import { Add, Remove, Delete, LocalShipping, Discount, Payment } from '@mui/icons-material';
import { updateCart, deleteCartItem, purchaseProduct } from '../../features/productActionSlice';
import axiosInstance from '../../axiosInstance';
import { toast } from 'react-toastify';
import './Cart.css'; // Import the CSS file


const CartDashboard = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.productActions.cart);
  const addresses = useSelector((state) => state.data.address);

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
    toast.success('Item removed from cart');
  };

  const handleButtonClick = () => {
    if (addresses.length > 0) {
      handlePlaceOrder();
    } else {
      toast.error("Please add a delivery address first!");
    }
  };

  const handlePlaceOrder = async () => {
    const cartItemsId = cartItems.map(item => item._id);
    const finalPrice = (totalPrice - 30 - 42);

    try {
      const res = await axiosInstance.post("/user/create-razorpay-order", { amount: finalPrice * 100 });
      const { id: order_id, currency } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY, 
        amount: finalPrice * 100,
        currency,
        name: "PharmaNest",
        description: "Purchase Medicines",
        order_id,
        handler: async function (response) {
          toast.success("Payment successful!");
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
    } catch (error) {
      toast.error("Failed to create order. Please try again.");
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.products?.price || 0) * item.quantity,
    0
  );

  return (
    <Box className="cart-container">
      <Typography variant="h4" className="cart-header">Your Shopping Cart</Typography>
      
      <Box className="cart-content mt-4">
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={8}>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <Card key={item._id} className="cart-item-card">
                  <Grid container>
                    <Grid item xs={12} sm={4}>
                      <img
                        src={item.products?.imageUrl?.url}
                        alt={item.products?.title}
                        className="cart-item-image"
                      />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {item.products?.title || 'Product Name'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {item.products?.description || 'Product description'}
                        </Typography>
                        <Typography variant="h6" paragraph>
                          ₹{item.products?.price.toLocaleString()} × {item.quantity} = ₹
                          {(item.products?.price * item.quantity).toLocaleString()}
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <div className="quantity-control">
                            <IconButton 
                              className="quantity-btn"
                              onClick={() => handleDecrement(item)} 
                              disabled={item.quantity === 1}
                            >
                              <Remove />
                            </IconButton>
                            <Typography>{item.quantity}</Typography>
                            <IconButton 
                              className="quantity-btn"
                              onClick={() => handleIncrement(item)}  
                              disabled={item.quantity === item.products?.quantity}
                            >
                              <Add />
                            </IconButton>
                          </div>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<Delete />}
                            className="remove-btn"
                            onClick={() => handleRemove(item._id)}
                          >
                            Remove
                          </Button>
                        </Stack>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              ))
            ) : (
              <Box className="empty-cart-container">
                <Typography variant="h5" color="textSecondary">
                  Your cart is empty
                </Typography>
                <Typography variant="body1" color="textSecondary" style={{ marginTop: '1rem' }}>
                  Looks like you haven't added anything to your cart yet
                </Typography>
              </Box>
            )}
          </Grid>

          {cartItems.length > 0 && (
            <Grid item xs={12} md={4}>
              <Card className="price-details-card">
                <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
                  PRICE DETAILS
                </Typography>
                
                <div className="price-detail-row">
                  <Typography>Price ({cartItems.length} items)</Typography>
                  <Typography>₹{totalPrice.toLocaleString()}</Typography>
                </div>
                
                <div className="price-detail-row">
                  <Typography>
                    <Discount className="discount-icon" fontSize="small" /> Discount
                  </Typography>
                  <Typography>₹0</Typography>
                </div>
                
                <div className="price-detail-row">
                  <Typography>Buy more & save more</Typography>
                  <Typography color="success.main">-₹30</Typography>
                </div>
                
                <div className="price-detail-row">
                  <Typography>Coupons for you</Typography>
                  <Typography color="success.main">-₹42</Typography>
                </div>
                
                <div className="price-detail-row">
                  <Typography>
                    <LocalShipping className="delivery-icon" fontSize="small" /> Delivery Charges
                  </Typography>
                  <Typography>
                    <s>₹100</s> <span style={{ color: '#4caf50' }}>Free</span>
                  </Typography>
                </div>
                
                <Divider className="divider" />
                
                <div className="price-detail-row">
                  <Typography variant="h6" className="total-amount">Total Amount</Typography>
                  <Typography variant="h6" className="total-amount">
                    ₹{(totalPrice - 30 - 42).toLocaleString()}
                  </Typography>
                </div>
                
                <Chip
                  label={`You save ₹${(30 + 42).toLocaleString()} on this order`}
                  className="savings-badge"
                  style={{ margin: '1rem 0', width: '100%' }}
                />
                
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  className="place-order-btn"
                  startIcon={<Payment />}
                  onClick={handleButtonClick}
                >
                  Place Order
                </Button>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default CartDashboard;