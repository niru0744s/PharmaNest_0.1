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

export default function GridLayout({ data }) {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.productActions.wishlist);
  const cart = useSelector((state) => state.productActions.cart);
  const limitedProducts = data?.products?.slice(0, 4);
  return (
    <Box className="bg-light m-2 p-3 rounded" sx={{ width: "33%" }}>
      <Typography variant="h5" className="mb-3 ms-2">
        {data?.category}
      </Typography>

      <Grid container spacing={2}>
        {limitedProducts?.map((ele, idx) => {
          const isLiked = wishlist?.some(item => item._id == ele._id);
          const isCart = cart?.some(item => item.products._id == ele._id);
          return (
            <Grid item xs={6} key={idx}>
              <Box
                sx={{
                  position: "relative",
                  ":hover .add-cart-btn": { opacity: 1 },

                }}
              >
                <Card
                  sx={{
                    position: "relative",
                    width: 210,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {/* ❤️ Wishlist */}
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
                    }
                    }
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
                    height="150"
                    image={ele.imageUrl?.url}
                    alt={ele.name}
                    sx={{ objectFit: "contain", mb: 1 }}
                  />
                  <CardContent className="text-center">
                    <Typography variant="body1">{ele.name}</Typography>
                    <Typography variant="h6" color="primary">
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
                        p:1,
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
                    }}
                    onClick={async () => {
                      if (localStorage.getItem('user')) {
                        await dispatch(addToCart({ productId: ele._id })).unwrap();

                      } else {
                        toast.error("You have to login first!");
                      }
                    }}
                  >
                    {isCart? "Already Added" : "Add to cart" }
                  </Button>
                  </Box>
                </Card>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  )
}

const data = [{
  title: "Baby product",
  image: "media/headerImg/img7.png",
  price: "800"
}, {
  title: "Baby product",
  image: "media/headerImg/img7.png",
  price: "800"
}, {
  title: "Baby product",
  image: "media/headerImg/img7.png",
  price: "800"
}, {
  title: "Baby product",
  image: "media/headerImg/img7.png",
  price: "800"
}, {
  title: "Baby product",
  image: "media/headerImg/img7.png",
  price: "800"
}, {
  title: "Baby product",
  image: "media/headerImg/img7.png",
  price: "800"
}, {
  title: "Baby product",
  image: "media/headerImg/img7.png",
  price: "800"
}, {
  title: "Baby product",
  image: "media/headerImg/img7.png",
  price: "800"
}, {
  title: "Baby product",
  image: "media/headerImg/img7.png",
  price: "800"
}, {
  title: "Baby product",
  image: "media/headerImg/img7.png",
  price: "800"
}, {
  title: "Baby product",
  image: "media/headerImg/img7.png",
  price: "800"
}, {
  title: "Baby product",
  image: "media/headerImg/img7.png",
  price: "800"
}]
