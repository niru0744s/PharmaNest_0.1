import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Box,
  Button
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
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
                  <IconButton
                    onClick={async () => {
                      if (localStorage.getItem('user')) {
                        if (isLiked) {
                          await dispatch(updateWishlist({ productId: ele._id })).unwrap();
                        } else {
                          await dispatch(addToWishlist({ productId: ele._id })).unwrap();
                        }
                      } else {
                        toast.error("You have to login first!");
                      }
                    }}
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      color: isLiked ? "red" : "grey",
                      zIndex: 2,
                    }}
                  >
                    <FavoriteIcon />
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
                    <Typography
                      variant="h6"
                      color="primary"
                      fontSize={{ xs: 14, sm: 16 }}
                    >
                      From ₹{ele.price || 0}
                    </Typography>
                  </CardContent>
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
                      sx={{
                        width: "80%",
                        backgroundColor: isCart ? "#ccc" : "#1976d2",
                        color: isCart ? "#888" : "white",
                        cursor: isCart ? "not-allowed" : "pointer",
                        pointerEvents: isCart ? "none" : "auto",
                        fontSize: { xs: 12, sm: 14 },
                      }}
                      onClick={async () => {
                        if (localStorage.getItem('user')) {
                          await dispatch(addToCart({ productId: ele._id })).unwrap();
                        } else {
                          toast.error("You have to login first!");
                        }
                      }}
                    >
                      {isCart ? "Already Added" : "Add to cart"}
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