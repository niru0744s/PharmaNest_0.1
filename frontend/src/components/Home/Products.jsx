import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  Button,
  Chip,
  Rating,
  Skeleton
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { addToWishlist, updateWishlist, addToCart } from "../../features/productActionSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Products.css";

const Products = ({ data, loading = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.productActions.wishlist);
  const cart = useSelector((state) => state.productActions.cart);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          arrows: false,
          dots: false
        }
      }
    ]
  };

  const showProduct = (id) => {
    navigate(`/show/${id}`);
  };

  return (
    <Box className="product-carousel-container">
      <Typography variant="h4" className="section-title" gutterBottom>
        {data?.category}
      </Typography>
      
      <Box className="slider-container">
        <Slider {...settings}>
          {(loading ? Array.from(new Array(6)) : data?.products)?.map((ele, idx) => (
            <div key={idx} className="product-card-wrapper">
              {loading ? (
                <Skeleton variant="rectangular" width="100%" height={320} />
              ) : (
                <Card className="product-card" elevation={3}>
                  {/* Product Badges */}
                  <Box className="product-badges">
                    {ele.isNew && <Chip label="New" size="small" className="new-badge" />}
                    {ele.discount > 0 && (
                      <Chip 
                        label={`${ele.discount}% OFF`} 
                        size="small" 
                        className="discount-badge"
                      />
                    )}
                  </Box>

                  {/* Wishlist Button */}
                  <IconButton
                    className={`wishlist-btn ${wishlist?.some(item => item._id === ele._id) ? 'active' : ''}`}
                    onClick={async () => {
                      if (localStorage.getItem('user')) {
                        if (wishlist?.some(item => item._id === ele._id)) {
                          await dispatch(updateWishlist({ productId: ele._id })).unwrap();
                        } else {
                          await dispatch(addToWishlist({ productId: ele._id })).unwrap();
                        }
                      } else {
                        toast.error("Please login to add to wishlist");
                      }
                    }}
                  >
                    {wishlist?.some(item => item._id === ele._id) ? (
                      <FavoriteIcon className="filled-heart" />
                    ) : (
                      <FavoriteBorderIcon className="outline-heart" />
                    )}
                  </IconButton>

                  {/* Product Image */}
                  <CardMedia
                    component="img"
                    className="product-image"
                    image={ele.imageUrl?.url || '/placeholder-product.jpg'}
                    alt={ele.name}
                    onClick={() => showProduct(ele._id)}
                  />

                  {/* Product Info */}
                  <CardContent className="product-info">
                    <Typography 
                      variant="subtitle1" 
                      className="product-name" 
                      onClick={() => showProduct(ele._id)}
                    >
                      {ele.name}
                    </Typography>
                    
                    <Rating 
                      value={ele.rating || 4} 
                      precision={0.5} 
                      readOnly 
                      size="small" 
                      className="product-rating"
                    />
                    
                    <Box className="price-container">
                      {ele.discount > 0 && (
                        <Typography variant="body2" className="original-price">
                          ₹{ele.price}
                        </Typography>
                      )}
                      <Typography variant="h6" className="current-price">
                        ₹{ele.discount > 0 
                          ? Math.round(ele.price * (1 - ele.discount/100))
                          : ele.price}
                      </Typography>
                    </Box>
                  </CardContent>

                  {/* Add to Cart Button */}
                  <Button
                    className={`add-to-cart-btn ${cart?.some(item => item.products._id === ele._id) ? 'added' : ''}`}
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={async () => {
                      if (localStorage.getItem('user')) {
                        await dispatch(addToCart({ productId: ele._id })).unwrap();
                      } else {
                        toast.error("Please login to add to cart");
                      }
                    }}
                    disabled={cart?.some(item => item.products._id === ele._id)}
                  >
                    {cart?.some(item => item.products._id === ele._id) ? "Added" : "Add to Cart"}
                  </Button>
                </Card>
              )}
            </div>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default Products;