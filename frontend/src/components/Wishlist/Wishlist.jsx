import React, { useEffect } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector, useDispatch } from "react-redux";
import { updateWishlist , fetchWishlist , addToCart } from "../../features/productActionSlice";
import Navbar from "../Header&Footer/Navbar";
import Footer from "../Header&Footer/Footer"
import { toast } from "react-toastify";

export default function Wishlist() {
  const dispatch = useDispatch();
  const  wishlist  = useSelector((state) => state.productActions.wishlist) || [];
  const cart = useSelector((state)=> state.productActions.cart);
  useEffect(()=>{
    if(localStorage.getItem("user")){
      dispatch(fetchWishlist());
    }
  },[dispatch])
  return (
    <Box className="container py-4">
      <Typography variant="h4" className="mb-2 text-center bg-light py-2">
        Your Wishlist
      </Typography>

      {wishlist.length ==  0 ? (
        <Typography className="text-center">No products in wishlist.</Typography>
      ) : (
        <Stack spacing={4}>
          {wishlist.map((item, idx) =>{
          const isCart = cart?.some(ele=> ele.products._id == item._id);
          return (
            <Card key={idx} sx={{ display: "flex", p: 2, position: "relative" }}>
              {/* Product Image */}
              <CardMedia
                component="img"
                image={item.imageUrl?.url || "/placeholder.png"}
                alt={item.name}
                sx={{ width: 150, height: 150, objectFit: "contain", borderRadius: 2 }}
              />

              {/* Product Details */}
              <CardContent sx={{ flex: 1, ml: 3 }}>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2"><strong>Brand:</strong> {item.brand}</Typography>
                <Typography variant="body2"><strong>Form:</strong> {item.form}</Typography>
                <Typography variant="body2"><strong>Strength:</strong> {item.strength}</Typography>
                <Typography variant="body2"><strong>Quantity:</strong> {item.quantity}</Typography>
                <Typography variant="body2" className="mt-2"><strong>Description:</strong> {item.description}</Typography>

                {/* Price Display */}
                <Typography variant="h6" className="mt-2">
                  {item.mainPrice && (
                    <span style={{ textDecoration: "line-through", marginRight: 8 }}>
                      ₹{item.mainPrice}
                    </span>
                  )}
                  <span style={{ color: "#1976d2" }}>From ₹{item.price}</span>
                </Typography>
                <Box className="d-flex gap-2 mt-3">
                  <Button
                    variant="contained"
                    disabled={isCart}
                    startIcon={<ShoppingCartIcon />}
                    onClick={async () =>{
                      if(localStorage.getItem('user')){
                        await  dispatch(addToCart({ productId: item._id})).unwrap();
                      }else{
                        toast.error("You have to login first!");
                      }
                    }
                      
                    }
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<FavoriteIcon />}
                    color="error"
                    onClick={async () =>{
                      await dispatch(updateWishlist({productId:item._id})).unwrap();
                      dispatch(fetchWishlist());
                    } 
                  }
                  >
                    Remove
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )})}
        </Stack>
      )}
    </Box>
  );
}
