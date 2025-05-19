import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Stack, Checkbox } from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {
  addToWishlist,
  updateWishlist,
  addToCart,
  purchaseProduct,
} from "../../features/productActionSlice";

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

  const handleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      dispatch(updateWishlist({productId:id}));
    } else {
      dispatch(addToWishlist({ productId: product._id }));
    }
  };

  if (!product) return <p>Product not found</p>;

  return (
    <div className="container bg-light p-4 mt-4 rounded">
      <div className="row">
        {/* LEFT - PRODUCT IMAGE */}
        <div className="col-md-5 d-flex justify-content-center align-items-center">
  <div className="position-relative">
    {/* Heart icon overlay */}
    <Checkbox
      icon={<FavoriteBorder />}
      checkedIcon={<Favorite />}
      checked={isWishlisted}
      onChange={() => handleWishlist()}
      sx={{
        color: isWishlisted ? "red" : "grey",
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 10,
        backgroundColor: "white",
        borderRadius: "50%",
        boxShadow: "0 0 5px rgba(0,0,0,0.15)"
      }}
    />

    {/* Product image */}
    <img
      src={product?.imageUrl?.url}
      alt={product?.name}
      className="img-fluid border"
      style={{ height: "300px", width: "300px", objectFit: "contain" }}
    />
  </div>
</div>


        {/* RIGHT - DETAILS */}
        <div className="col-md-7">
          <h4 className="fw-bold">{product?.name || "Wet Wipes"}</h4>
          <p className="text-muted mb-1">(Pack of 50, Pampers)</p>

          {/* Rating */}
          <span className="badge bg-success me-2">4.1★</span>
          <span className="text-muted small">7,31,021 Ratings & 40,745 Reviews</span>

          <hr />

          {/* Pricing */}
          <h5 className="text-success fw-bold">
            ₹{product?.price || 110}
            <small className="text-decoration-line-through text-muted ms-2">
              ₹{product?.mainPrice || 130}
            </small>
            <span className="text-success ms-2">80% off</span>
          </h5>
          <p className="text-muted small">Secure delivery in 2 Days</p>
          <p className="text-warning fw-bold">
            Or Pay ₹60 + <span className="text-warning">50 🪙</span>
          </p>

          {/* Action Buttons */}
          <div className="d-flex gap-3 mt-3">
  <Button
    variant="contained"
    color="success"
    disabled={cart.some(item => item.products._id === product._id)}
    onClick={() =>
      dispatch(addToCart({ productId: product._id, quantity: 1 }))
    }
  >
    {cart.some(item => item.products._id === product._id) ? "IN CART" : "ADD TO CART"}
  </Button>
</div>

          {/* Extra info */}
          <hr />
          <h6>Product Details</h6>
          <ul className="list-unstyled small">
            <li>Brand: Pampers</li>
            <li>Pack: 50 wet wipes</li>
            <li>Fragrance: Aloe Vera</li>
            <li>Usage: Suitable for baby skin</li>
          </ul>

          <h6>Seller Info</h6>
          <p className="small">
            Sold by <strong>HealthPlus Distributors</strong> (4.7★, 12,000 ratings)
          </p>
        </div>
      </div>
    </div>
  );
}
