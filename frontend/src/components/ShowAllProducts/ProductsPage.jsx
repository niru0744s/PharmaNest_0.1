import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Box,
  IconButton,
  Button,
  Rating,
  Chip,
  Divider
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { addToWishlist, updateWishlist, addToCart } from "../../features/productActionSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import './ProductsPage.css';

export default function ProductsPage({ product }) {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.productActions.wishlist);
  const cart = useSelector((state) => state.productActions.cart);

  if (!product) return (
    <Box className="products-page-empty-container">
      <Typography variant="h4" className="products-page-empty-message">
        No products found
      </Typography>
    </Box>
  );

  return (
    <Box className="products-page-main-container">
      <Typography variant="h4" className="products-page-title">
        {product.category || "All Products"}
      </Typography>
      
      <Box className="products-page-list-container">
        {product.products.map((item, idx) => {
          const isLiked = wishlist.some(ele => ele._id === item._id);
          const isCart = cart?.some(ele => ele.products._id === item._id);
          const hasDiscount = item.mainPrice && item.mainPrice > item.price;

          return (
            <Grid item xs={12} key={idx} className="products-page-item-wrapper">
              <Card className="products-page-product-card">
                {/* Wishlist Button */}
                <IconButton
                  className={`products-page-wishlist-btn ${isLiked ? 'products-page-wishlist-active' : ''}`}
                  onClick={async () => {
                    if (localStorage.getItem('user')) {
                      if (isLiked) {
                        await dispatch(updateWishlist({ productId: item._id })).unwrap();
                        toast.success("Removed from wishlist");
                      } else {
                        await dispatch(addToWishlist({ productId: item._id })).unwrap();
                        toast.success("Added to wishlist");
                      }
                    } else {
                      toast.error("Please login to manage wishlist");
                    }
                  }}
                >
                  {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>

                {/* Product Image */}
                <CardMedia
                  component="img"
                  image={item.imageUrl?.url || "/placeholder-product.png"}
                  alt={item.name}
                  className="products-page-product-image"
                />

                {/* Product Details */}
                <CardContent className="products-page-details-container">
                  <Typography variant="h6" className="products-page-product-name">
                    {item.name}
                  </Typography>
                  
                  {/* Rating */}
                  <Rating 
                    value={item.rating || 4} 
                    precision={0.5} 
                    readOnly 
                    className="products-page-rating"
                  />
                  
                  {/* Product Specifications */}
                  <Box className="products-page-specs-grid">
                    <Typography variant="body2" className="products-page-spec-text">
                      <strong>Brand:</strong> {item.brand}
                    </Typography>
                    <Typography variant="body2" className="products-page-spec-text">
                      <strong>Form:</strong> {item.form}
                    </Typography>
                    <Typography variant="body2" className="products-page-spec-text">
                      <strong>Strength:</strong> {item.strength}
                    </Typography>
                    <Typography variant="body2" className="products-page-spec-text">
                      <strong>Quantity:</strong> {item.quantity}
                    </Typography>
                  </Box>

                  <Divider className="products-page-divider" />

                  {/* Price Section */}
                  <Box className="products-page-price-section">
                    {hasDiscount && (
                      <Typography variant="body2" className="products-page-original-price">
                        ₹{item.mainPrice}
                      </Typography>
                    )}
                    <Typography variant="h6" className="products-page-current-price">
                      ₹{item.price}
                    </Typography>
                    {hasDiscount && (
                      <Chip 
                        label={`${Math.round((1 - item.price/item.mainPrice) * 100)}% OFF`} 
                        size="small" 
                        className="products-page-discount-badge"
                      />
                    )}
                  </Box>

                  {/* Add to Cart Button */}
                  <Button
                    variant="contained"
                    className={`products-page-cart-btn ${isCart ? 'products-page-cart-added' : ''}`}
                    startIcon={<ShoppingCartIcon className="products-page-cart-icon" />}
                    fullWidth
                    onClick={async () => {
                      if (localStorage.getItem('token')) {
                        await dispatch(addToCart({ productId: item._id })).unwrap();
                        toast.success("Added to cart!");
                      } else {
                        toast.error("Please login to add to cart");
                      }
                    }}
                    disabled={isCart}
                  >
                    {isCart ? "Added to Cart" : "Add to Cart"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Box>
    </Box>
  );
}