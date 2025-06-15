import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  Button,
  Rating
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { addToWishlist, updateWishlist, addToCart } from "../../features/productActionSlice";
import { toast } from "react-toastify";
import './Home.css';

export default function GridLayout({ data }) {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.productActions.wishlist);
  const cart = useSelector((state) => state.productActions.cart);
  const limitedProducts = data?.products?.slice(0, 4);

  return (
    <div className="bg-light m-2 p-3 rounded g-cont">
      <Typography variant="h5" className="mb-3 ms-2 text-center fw-bold" color="#1976d2">
        {data?.category}
      </Typography>

      <div className="row">
        {limitedProducts?.map((ele, idx) => {
          const isLiked = wishlist?.some(item => item._id == ele._id);
          const isCart = cart?.some(item => item.products._id == ele._id);
          return (
            <div className="col-6 col-sm-6 col-md-6 col-lg-6 mt-1" key={idx}>
              <Box
                sx={{
                  position: "relative",
                  ":hover .add-cart-btn": { opacity: 1 },
                }}
              >
                <Card
                  sx={{
                    position: "relative",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {/* Like Button with improved styling */}
                  <IconButton
                    onClick={async () => {
                      if (localStorage.getItem('user')) {
                        if (isLiked) {
                          await dispatch(updateWishlist({ productId: ele._id })).unwrap();
                          toast.success("Removed from wishlist");
                        } else {
                          await dispatch(addToWishlist({ productId: ele._id })).unwrap();
                          toast.success("Added to wishlist");
                        }
                      } else {
                        toast.error("Please login to manage wishlist");
                      }
                    }}
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      color: isLiked ? "red" : "rgba(0,0,0,0.5)",
                      zIndex: 2,
                      backgroundColor: "rgba(255,255,255,0.8)",
                      '&:hover': {
                        backgroundColor: "white",
                        transform: "scale(1.1)"
                      },
                      transition: "all 0.2s ease"
                    }}
                  >
                    {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>

                  <CardMedia
                    component="img"
                    image={ele.imageUrl?.url}
                    alt={ele.name}
                    sx={{
                      objectFit: "contain",
                      height: { xs: "8rem", sm: 140 },
                      width: { xs: "7rem", sm: "8rem", md: "10rem" },
                      mt: 2,
                      mb: 1,
                    }}
                  />

                  <CardContent className="text-center" sx={{ px: 1 }}>
                    <Typography variant="body2" fontSize={{xs: 10}}>{ele.name}</Typography>
                    
                    {/* Added Rating Component */}
                    <Rating 
                      name="read-only"
                      value={ele.rating || 4} 
                      precision={0.5}
                      readOnly
                      size="small"
                      sx={{ 
                        my: 0.5,
                        '& .MuiRating-icon': {
                          fontSize: { xs: '1rem', sm: '1.2rem' }
                        }
                      }}
                    />
                    
                    <Typography
                      variant="h6"
                      color="primary"
                      fontSize={{ xs: 14, sm: 16 }}
                    >
                      From ₹{ele.price || 0}
                    </Typography>
                  </CardContent>

                  {/* Enhanced Add to Cart Button */}
                  <Box
                    className="add-cart-btn"
                    sx={{
                      width: "100%",
                      textAlign: "center",
                      fontSize: 14,
                      fontWeight: 500,
                      p: 1,
                      opacity: 0,
                      transition: "0.3s",
                      zIndex: 5,
                      borderBottomLeftRadius: "8px",
                      borderBottomRightRadius: "8px",
                    }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCartIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                      sx={{
                        width: "80%",
                        backgroundColor: isCart ? "#4caf50" : "#1976d2",
                        color: "white",
                        cursor: isCart ? "default" : "pointer",
                        fontSize: { xs: 12, sm: 14 },
                        '&:hover': {
                          backgroundColor: isCart ? "#4caf50" : "#1565c0",
                          transform: isCart ? "none" : "translateY(-2px)",
                          boxShadow: isCart ? "none" : "0 2px 5px rgba(0,0,0,0.2)"
                        },
                        transition: "all 0.2s ease",
                        textTransform: "none",
                        borderRadius: "20px",
                        py: 0.5
                      }}
                      onClick={async () => {
                        if (!isCart && localStorage.getItem('user')) {
                          await dispatch(addToCart({ productId: ele._id })).unwrap();
                          toast.success("Added to cart!");
                        } else if (!localStorage.getItem('user')) {
                          toast.error("Please login to add to cart");
                        }
                      }}
                    >
                      {isCart ? "Added to Cart" : "Add to Cart"}
                    </Button>
                  </Box>
                </Card>
              </Box>
            </div>
          );
        })}
      </div>
    </div>
  )
}