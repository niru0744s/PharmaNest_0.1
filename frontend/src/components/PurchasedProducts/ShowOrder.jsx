import React from "react";
import { useSelector } from "react-redux";
import { 
  Card, 
  Typography, 
  Box, 
  Button, 
  Divider,
  Paper,
  Avatar,
  Stack,
  Chip
} from "@mui/material";
import { 
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  LocalShipping,
  Receipt,
  AssignmentReturn,
  CheckCircle,
  Cancel,
  HourglassEmpty
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { cancelOrder } from "../../features/productActionSlice";
import { useTheme } from "@mui/material/styles";

const ShowOrder = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.productActions.purchases);

  const getStatusIcon = (status) => {
    switch(status) {
      case "pending":
        return <HourglassEmpty color="warning" />;
      case "shipped":
        return <LocalShipping color="info" />;
      case "on_the_way":
        return <LocalShipping color="primary" />;
      case "delivered":
        return <CheckCircle color="success" />;
      case "cancelled":
        return <Cancel color="error" />;
      default:
        return <HourglassEmpty color="disabled" />;
    }
  };

  if (orders.length === 0) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        p: 4
      }}>
        <Avatar sx={{ 
          bgcolor: theme.palette.grey[200],
          width: 80,
          height: 80,
          mb: 3
        }}>
          <Receipt sx={{ fontSize: 40, color: theme.palette.grey[500] }} />
        </Avatar>
        <Typography variant="h5" sx={{ mb: 1 }}>
          No Orders Yet
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your order history will appear here once you make a purchase
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Your Orders
      </Typography>

      {orders.map((order, i) => (
        <Paper key={i} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
          {/* Order Header */}
          <Box sx={{ 
            p: 2, 
            bgcolor: theme.palette.grey[100],
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Order #{order._id.slice(-6).toUpperCase()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')}
              </Typography>
            </Box>
            <Chip 
              label={order.status.replace(/_/g, ' ')} 
              icon={getStatusIcon(order.status)}
              color={
                order.status === "delivered" ? "success" :
                order.status === "cancelled" ? "error" :
                order.status === "pending" ? "warning" : "info"
              }
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Left - Products */}
            <Box sx={{ flex: 2, p: 3 }}>
              {order.products.map((item, index) => (
                <Box key={index} sx={{ 
                  display: 'flex', 
                  mb: 3,
                  p: 2,
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: theme.palette.grey[50]
                  }
                }}>
                  <Box sx={{ 
                    width: 100, 
                    height: 100, 
                    bgcolor: theme.palette.grey[100],
                    borderRadius: 1,
                    overflow: 'hidden',
                    mr: 2,
                    flexShrink: 0
                  }}>
                    <img
                      src={item?.product?.imageUrl?.url || '/placeholder-product.png'}
                      alt={item?.product?.name}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain' 
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.product.brand}, {item.product.category}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 1 }}>
                      ₹{item.product.price}
                    </Typography>

                    {/* Rating and Review */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <Stack direction="row" spacing={0.5}>
                        {[...Array(4)].map((_, i) => (
                          <StarIcon key={i} fontSize="small" color="primary" />
                        ))}
                        <StarBorderIcon fontSize="small" color="primary" />
                      </Stack>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ ml: 2 }}
                        startIcon={<Receipt fontSize="small" />}
                      >
                        Add Review
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ))}

              {/* Order Timeline */}
              <Paper sx={{ p: 2, mt: 3, bgcolor: theme.palette.grey[50] }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Order Updates
                </Typography>
                <Box component="ul" sx={{ 
                  pl: 2,
                  listStyleType: 'none',
                  '& li': {
                    position: 'relative',
                    pl: 3,
                    mb: 1.5,
                    '&:before': {
                      content: '"✓"',
                      position: 'absolute',
                      left: 0,
                      color: theme.palette.success.main
                    }
                  }
                }}>
                  <li>
                    <Typography variant="body2">
                      Order placed on <strong>{new Date(order.createdAt).toLocaleString('en-IN')}</strong>
                    </Typography>
                  </li>
                  {order.status === "shipped" && (
                    <li>
                      <Typography variant="body2">
                        Shipped on <strong>{new Date(order.updatedAt).toLocaleString('en-IN')}</strong>
                      </Typography>
                    </li>
                  )}
                  {order.status === "on_the_way" && (
                    <li>
                      <Typography variant="body2">
                        Out for delivery on <strong>{new Date(order.updatedAt).toLocaleString('en-IN')}</strong>
                      </Typography>
                    </li>
                  )}
                  {order.status === "delivered" && (
                    <li>
                      <Typography variant="body2">
                        Delivered on <strong>{new Date(order.updatedAt).toLocaleString('en-IN')}</strong>
                      </Typography>
                    </li>
                  )}
                  {order.status === "cancelled" && (
                    <li>
                      <Typography variant="body2">
                        Cancelled on <strong>{new Date(order.updatedAt).toLocaleString('en-IN')}</strong>
                      </Typography>
                    </li>
                  )}
                </Box>
              </Paper>

              {/* Cancel Order Button */}
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  disabled={order.status === "delivered" || order.status === "cancelled"}
                  onClick={() => dispatch(cancelOrder(order._id))}
                  startIcon={<AssignmentReturn />}
                >
                  {order.status === "cancelled" ? "Order Cancelled" : "Cancel Order"}
                </Button>
              </Box>
            </Box>

            {/* Right - Order Summary */}
            <Box sx={{ 
              flex: 1, 
              p: 3, 
              bgcolor: theme.palette.grey[50],
              borderLeft: { md: `1px solid ${theme.palette.divider}` },
              borderTop: { xs: `1px solid ${theme.palette.divider}`, md: 'none' }
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Order Summary
              </Typography>

              <Card sx={{ mb: 3, p: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Shipping Address
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {order.address.name}
                </Typography>
                <Typography variant="body2">
                  {order.address.address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Phone: {order.address.mobileNum}
                </Typography>
              </Card>

              <Card sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Price Details
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Subtotal</Typography>
                    <Typography variant="body2">₹{order.totalAmount}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Shipping</Typography>
                    <Typography variant="body2" color="success.main">Free</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Total</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>₹{order.totalAmount}</Typography>
                  </Box>
                </Stack>
              </Card>

              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 3 }}
                startIcon={<Receipt />}
              >
                Download Invoice
              </Button>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default ShowOrder;