import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  Button, 
  Typography, 
  Divider,
  Chip,
  Rating,
  Box,
  Stack,
  IconButton
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StoreIcon from "@mui/icons-material/Store";
import {
  addToWishlist,
  updateWishlist,
  addToCart,
} from "../../features/productActionSlice";
import { toast } from "react-toastify";
import './ProductDetails.css';

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.data);
  const wishlist = useSelector((state) => state.productActions.wishlist);
  const cart = useSelector((state) => state.productActions.cart);

  // Flatten all products from categories
  const allProducts = categories.flatMap((c) => c.products);
  const product = allProducts.find((p) => p._id === id);

  const isWishlisted = Array.isArray(wishlist) && wishlist.some(item => item?._id === id);
  const isInCart = Array.isArray(cart) && cart.some(item => item?.products?._id === id);
  const discountPercentage = product?.mainPrice 
    ? Math.round(((product.mainPrice - product.price) / product.mainPrice) * 100)
    : 0;

  const handleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      dispatch(updateWishlist({productId:id}));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist({ productId: product._id }));
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCart = () => {
    if (!isInCart) {
      dispatch(addToCart({ productId: product._id, quantity: 1 }));
      toast.success("Added to cart");
    }
  };

  if (!product) return (
    <Box className="product-not-found">
      <Typography variant="h5">Product not found</Typography>
    </Box>
  );

  return (
    <Box className="product-detail-container">
      {/* Product Image Section */}
      <Box className="product-image-container">
        <img 
          src={product?.imageUrl?.url || '/placeholder-product.png'} 
          alt={product?.name} 
          className="product-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-product.png';
          }}
        />
        <IconButton 
          className={`wishlist-button ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlist}
        >
          {isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>

      {/* Product Details Section */}
      <Box className="product-detail-content">
        <Typography variant="h4" className="product-title">
          {product?.name || "Surgical Tape"}
        </Typography>
        <Typography variant="body1" className="product-description">
          {product?.description || "Hypoallergenic tape for securing dressings."}
        </Typography>

        {/* Rating and Reviews */}
        <Box className="rating-container">
          <Box className="rating-box">
            <Typography variant="h5" className="rating-value">4.1</Typography>
            <Rating value={4.1} precision={0.1} readOnly size="small" />
            <Typography variant="body2" className="rating-count">76 ratings</Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Typography variant="body2" className="reviews-text">
            731,021 Ratings & 40,745 Reviews
          </Typography>
        </Box>

        {/* Price Section */}
        <Box className="price-container">
          <Typography variant="h3" className="current-price">₹765</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body1" className="original-price">₹820</Typography>
            <Chip label="7% OFF" size="small" className="discount-chip" />
          </Stack>
        </Box>

        <Divider className="divider" />

        {/* Delivery Info */}
        <Box className="delivery-info">
          <LocalShippingIcon fontSize="small" />
          <Typography variant="body2">
            <strong>Delivery:</strong> Secure delivery in 2-3 days
          </Typography>
        </Box>

        {/* Add to Cart Button */}
        <Button
          variant="contained"
          fullWidth
          className="add-to-cart-btn"
          startIcon={<AddShoppingCartIcon />}
          onClick={handleAddToCart}
          disabled={isInCart}
        >
          {isInCart ? "ADDED TO CART" : "ADD TO CART"}
        </Button>

        <Divider className="divider" />

        {/* Seller Info */}
        <Box className="seller-info">
          <StoreIcon fontSize="small" />
          <Box>
            <Typography variant="subtitle1"><strong>Seller Information</strong></Typography>
            <Typography variant="body2">
              Sold by <strong>HealthPlus Distributors</strong> (4.7★, 12,000 ratings)
            </Typography>
            <Typography variant="body2">
              Genuine products sourced directly from manufacturers
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}