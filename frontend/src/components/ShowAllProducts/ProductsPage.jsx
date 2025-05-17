import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { addToWishlist, updateWishlist, addToCart } from "../../features/productActionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export default function ProductsPage({ product }) {
  if (!product) return <Typography>No products found.</Typography>;
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.productActions.wishlist);
  const cart = useSelector((state) => state.productActions.cart);
  return (
    <Box className="container py-4">
      <Typography variant="h4" className="mb-4 text-center">
        {product.category || "All Products"}
      </Typography>
      <Box className="d-flex flex-column gap-4">
        {product.products.map((item, idx) => {
          const isLiked = wishlist.some(ele => ele._id == item._id);
          const isCart = cart?.some(ele => ele.products == item._id);
          return (
            <Grid item xs={12} key={idx}>
              <Card className="d-flex flex-row align-items-center p-3" sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  image={item.imageUrl?.url || "/placeholder.png"}
                  alt={item.name}
                  sx={{ width: 150, height: 150, objectFit: "contain", borderRadius: 2 }}
                />
                <CardContent sx={{ flex: 1, ml: 3 }}>
                  <Typography variant="h6" className="mb-1">
                    {item.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Brand:</strong> {item.brand}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Form:</strong> {item.form}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Strength:</strong> {item.strength}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Quantity:</strong> {item.quantity}
                  </Typography>
                  <Typography variant="body2" className="mt-2">
                    <strong>Description:</strong> {item.description}
                  </Typography>

                  {/* 💰 Price */}
                  <Typography variant="h6" className="mt-2">
                    <span style={{ textDecoration: "line-through", marginRight: 8 }}>
                      ₹{item.mainPrice}
                    </span>
                    <span style={{ color: "#1976d2" }}>From ₹{item.price}</span>
                  </Typography>

                  {/* 🛒 Add to Cart */}
                  <Button
                    variant="contained"
                    className="mt-3"
                    startIcon={<ShoppingCartIcon />}
                    sx={{
                      backgroundColor: isCart ? "#ccc" : "#1976d2",
                      color: isCart ? "#888" : "white",
                      cursor: isCart ? "not-allowed" : "pointer",
                      pointerEvents: isCart ? "none" : "auto",
                    }}
                    onClick={async () => {
                      if (localStorage.getItem('user')) {
                        await dispatch(addToCart({ productId: item._id })).unwrap();

                      } else {
                        toast.error("You have to login first!");
                      }
                    }}
                  >
                    {isCart ? "Already Added" : "Add to cart"}
                  </Button>
                </CardContent>
                <IconButton
                  onClick={async () => {
                    if (localStorage.getItem('user')) {
                      if (isLiked) {
                        await dispatch(updateWishlist({ productId: item._id })).unwrap();
                      } else {
                        await dispatch(addToWishlist({ productId: item._id })).unwrap();
                      }
                    } else {
                      toast.error("You have to login first!");
                    }
                  }}
                  sx={{ position: "absolute", top: 10, right: 10, color: isLiked ? "red" : "grey", zIndex: 2 }}
                >
                  <FavoriteIcon />
                </IconButton>
              </Card>
            </Grid>
          )
        })}
      </Box>
    </Box>
  )
}
