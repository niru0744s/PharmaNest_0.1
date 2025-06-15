import React, { useEffect } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  Divider
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector, useDispatch } from "react-redux";
import { updateWishlist, fetchWishlist, addToCart } from "../../features/productActionSlice";
import { toast } from "react-toastify";
import "./Wishlist.css";

export default function Wishlist() {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.productActions.wishlist) || [];
  const cart = useSelector((state) => state.productActions.cart);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      dispatch(fetchWishlist());
    }
  }, [dispatch]);

  return (
    <Box className="wishlist-container">
      <Typography variant="h4" className="wishlist-title">
        Your Wishlist
      </Typography>

      {wishlist.length === 0 ? (
        <Box className="wishlist-empty-container">
          <FavoriteIcon className="wishlist-empty-icon" />
          <Typography variant="h6" className="wishlist-empty-text">
            Your wishlist is empty
          </Typography>
          <Typography variant="body2" className="wishlist-empty-subtext">
            Save your favorite products by clicking the heart icon
          </Typography>
        </Box>
      ) : (
        <Stack spacing={3}>
          {wishlist.map((item, idx) => {
            const isCart = cart?.some(ele => ele.products._id === item._id);
            const discountPercentage = item.mainPrice 
              ? Math.round(((item.mainPrice - item.price) / item.mainPrice) * 100)
              : 0;

            return (
              <Card key={idx} className="wishlist-item mt-4">
                <CardMedia
                  component="img"
                  image={item.imageUrl?.url || "/placeholder.png"}
                  alt={item.name}
                  className="wishlisted-item-image"
                  style={{width:"20%"}}
                />

                <CardContent className="wishlist-item-content">
                  <Typography variant="h6" className="wishlist-item-name">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" className="wishlist-item-detail">
                    <strong>Brand:</strong> {item.brand}
                  </Typography>
                  <Typography variant="body2" className="wishlist-item-detail">
                    <strong>Form:</strong> {item.form}
                  </Typography>
                  <Typography variant="body2" className="wishlist-item-detail">
                    <strong>Strength:</strong> {item.strength}
                  </Typography>
                  <Typography variant="body2" className="wishlist-item-detail">
                    <strong>Quantity:</strong> {item.quantity}
                  </Typography>

                  <Divider className="wishlist-divider" />

                  <Box className="wishlist-price-container">
                    {item.mainPrice && (
                      <Typography variant="body2" className="wishlist-original-price">
                        ₹{item.mainPrice}
                      </Typography>
                    )}
                    <Typography variant="h6" className="wishlist-current-price">
                      ₹{item.price}
                    </Typography>
                    {discountPercentage > 0 && (
                      <Chip 
                        label={`${discountPercentage}% OFF`} 
                        size="small" 
                        className="wishlist-discount-chip"
                      />
                    )}
                  </Box>

                  <Box className="wishlist-actions">
                    <Button
                      variant="contained"
                      className="wishlist-cart-btn"
                      startIcon={<ShoppingCartIcon />}
                      onClick={async () => {
                        if (localStorage.getItem('user')) {
                          await dispatch(addToCart({ productId: item._id }));
                          toast.success("Added to cart!");
                        } else {
                          toast.error("You have to login first!");
                        }
                      }}
                      disabled={isCart}
                    >
                      {isCart ? "In Cart" : "Add to Cart"}
                    </Button>
                    <Button
                      variant="outlined"
                      className="wishlist-remove-btn"
                      startIcon={<FavoriteIcon />}
                      color="error"
                      onClick={async () => {
                        await dispatch(updateWishlist({ productId: item._id }));
                        toast.success("Removed from wishlist");
                        dispatch(fetchWishlist());
                      }}
                    >
                      Remove
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}