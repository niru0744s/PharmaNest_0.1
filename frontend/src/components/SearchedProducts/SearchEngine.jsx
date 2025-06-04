import React from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Checkbox,
} from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {
  addToWishlist,
  updateWishlist,
  addToCart,
} from "../../features/productActionSlice";
import Navbar from "../Header&Footer/Navbar";
import Footer from "../Header&Footer/Footer";

export default function SearchEngine() {
  const { categoryName } = useParams();
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.data);
  const wishlist = useSelector((state) => state.productActions.wishlist);
  const cart = useSelector((state) => state.productActions.cart);

  const categoryData = categories.find(
    (c) => c.category.toLowerCase() === categoryName.toLowerCase()
  );

  if (!categoryData) {
    return <Typography variant="h6">No products found for this category.</Typography>;
  }

  const handleWishlist = (product) => {
    if (!product) return;
    const isWishlisted = wishlist.some((item) => item._id === product._id);
    if (isWishlisted) {
      dispatch(updateWishlist({ productId: product._id }));
    } else {
      dispatch(addToWishlist({ productId: product._id }));
    }
  };

  const handleAddToCart = (product) => {
    if (!product) return;
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };

  return (
    <>
    <Navbar/>
    <div className="container mt-4">
      <h4 className="fw-bold mb-4">Category: {categoryData.category}</h4>

      <Grid container spacing={3}>
        {categoryData.products.map((product) => {
          const isWishlisted = wishlist.some((item) => item._id === product._id);
          const isInCart = cart.some((item) => item.products._id === product._id);

          return (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card className="shadow-sm h-100">
                <CardContent>
                  {/* Wishlist Heart Icon */}
                  <div className="position-relative">
                    <Checkbox
                      icon={<FavoriteBorder />}
                      checkedIcon={<Favorite />}
                      checked={isWishlisted}
                      onChange={() => handleWishlist(product)}
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        color: isWishlisted ? "red" : "grey",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                        zIndex: 10,
                      }}
                    />

                    {/* Product Image */}
                    <img
                      src={product?.imageUrl?.url}
                      alt={product?.name}
                      className="img-fluid mx-auto d-block border rounded"
                      style={{
                        height: "200px",
                        objectFit: "contain",
                        width: "100%",
                      }}
                    />
                  </div>

                  <Typography variant="h6" className="mt-3">
                    {product?.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {product?.brand} | {product?.form} | {product?.strength}
                  </Typography>

                  <Typography className="fw-bold text-success mt-2">
                    ₹{product?.price || 110}
                    <small className="text-decoration-line-through text-muted ms-2">
                      ₹{product?.mainPrice || 130}
                    </small>
                  </Typography>

                  <Typography variant="body2" color="textSecondary">
                    2-day delivery
                  </Typography>

                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<AddShoppingCartIcon />}
                    disabled={isInCart}
                    onClick={() => handleAddToCart(product)}
                    sx={{ mt: 2 }}
                  >
                    {isInCart ? "In Cart" : "Add to Cart"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
    <Footer/>
    </>
  );
}
