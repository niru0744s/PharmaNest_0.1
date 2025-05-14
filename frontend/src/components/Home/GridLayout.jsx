import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Box,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { updateWishlist } from "../../features/productActionSlice";

export default function GridLayout({data}) {
    const dispatch = useDispatch();
    const wishlist = useSelector((state) => state.productActions.wishlist);
    const limitedProducts = data?.products?.slice(0, 4);
    return (
        <Box className="bg-light m-2 p-3 rounded">
      <Typography variant="h5" className="mb-3 ms-2">
        {data?.category}
      </Typography>

      <Grid container spacing={2}>
        {limitedProducts?.map((ele, idx) => {
          const isLiked = wishlist.includes(ele._id);

          return (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Box
                sx={{
                  position: "relative",
                  ":hover .add-cart-btn": { opacity: 1 },
                }}
              >
                <Card
                  sx={{
                    width: "100%",
                    minHeight: 280,
                    position: "relative",
                    px: 0,
                    pt: 1,
                    pb: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {/* ❤️ Wishlist Icon */}
                  <IconButton
                    onClick={() =>
                      dispatch(updateWishlist({ productId: ele._id, liked: !isLiked }))
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

                  {/* 🖼️ Product Image */}
                  <CardMedia
                    component="img"
                    height="150"
                    image={ele.imageUrl?.url}
                    alt={ele.name}
                    sx={{ objectFit: "contain", mb: 1 }}
                  />

                  {/* 📦 Product Info */}
                  <CardContent className="text-center">
                    <Typography variant="body1">{ele.name}</Typography>
                    <Typography variant="h6" color="primary">
                      From ₹{ele.price || 0}
                    </Typography>
                  </CardContent>

                  {/* 🛒 Add to Cart Button */}
                  <Box
                    className="add-cart-btn"
                    sx={{
                      width: "100%",
                      backgroundColor: "#1976d2",
                      color: "white",
                      textAlign: "center",
                      fontSize: 14,
                      fontWeight: 500,
                      py: 1,
                      opacity: 0,
                      transition: "0.3s",
                      cursor: "pointer",
                      zIndex: 5,
                      borderBottomLeftRadius: "8px",
                      borderBottomRightRadius: "8px",
                    }}
                  >
                    Add to Cart
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
    title:"Baby product",
    image:"media/headerImg/img7.png",
    price:"800"
  },{
    title:"Baby product",
    image:"media/headerImg/img7.png",
    price:"800"
  },{
    title:"Baby product",
    image:"media/headerImg/img7.png",
    price:"800"
  },{
    title:"Baby product",
    image:"media/headerImg/img7.png",
    price:"800"
  },{
    title:"Baby product",
    image:"media/headerImg/img7.png",
    price:"800"
  },{
    title:"Baby product",
    image:"media/headerImg/img7.png",
    price:"800"
  },{
    title:"Baby product",
    image:"media/headerImg/img7.png",
    price:"800"
  },{
    title:"Baby product",
    image:"media/headerImg/img7.png",
    price:"800"
  },{
    title:"Baby product",
    image:"media/headerImg/img7.png",
    price:"800"
  },{
    title:"Baby product",
    image:"media/headerImg/img7.png",
    price:"800"
  },{
    title:"Baby product",
    image:"media/headerImg/img7.png",
    price:"800"
  },{
    title:"Baby product",
    image:"media/headerImg/img7.png",
    price:"800"
  }]
