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
  responsiveFontSizes
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { addToWishlist, updateWishlist , addToCart  } from "../../features/productActionSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Products = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.productActions.wishlist);
  const cart = useSelector((state)=> state.productActions.cart);
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
  };

  const showProduct = (id)=>{
    navigate(`/show/${id}`);
  };
  return (
    <>
      <div
        className="bg-light m-2 p-3 rounded"
        style={{ position: "relative", minHeight: "22rem" }}
      >
        <h3 className="ms-2 mb-3 text-center" style={{color:"#1976d2"}}>{data?.category}</h3>

        <Slider {...settings}>
          {data?.products?.map((ele, idx) => {
           const isLiked = wishlist?.some(item => item._id == ele._id);
           const isCart = cart?.some(item => item.products._id == ele._id);
            return (
              <div className="d-flex justify-content-center" key={idx}>
                <Box
                  sx={{
                    position: "relative",
                    ":hover .add-cart-btn": { opacity: 1 },
                  }}
                >
                  <Card
                    sx={{
                      width: 220,
                      minHeight: 280,
                      position: "relative",
                      px: 0, // REMOVE horizontal padding
                      pt: 1,
                      pb: 0,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Like Icon */}
                    <IconButton
                      onClick={async () =>{
                        if(localStorage.getItem('user')){
                          if(isLiked){
                          await dispatch(updateWishlist({ productId: ele._id})).unwrap();
                        }else{
                          await dispatch(addToWishlist({ productId: ele._id})).unwrap();
                        }
                        }else{
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

                    {/* Product Image */}
                    <CardMedia
                      component="img"
                      height="150"
                      image={ele.imageUrl?.url}
                      alt={ele.name}
                      sx={{ objectFit: "contain", mb: 1 }}
                      onClick={()=>{showProduct(ele._id)}}
                    />

                    {/* Product Info */}
                    <CardContent className="text-center">
                      <Typography variant="body1" className="mb-1" color="secondary">
                        {ele.name}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        From ₹{ele.price}
                      </Typography>
                    </CardContent>

                    {/* Add to Cart Button (moved inside card) */}
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
                        backgroundColor: isCart? "#ccc" : "#1976d2",
                        color: isCart? "#888":"white",
                        cursor: isCart? "not-allowed":"pointer",
                        pointerEvents: isCart? "none" : "auto",
                      }}
                      onClick={async()=>{
                        if(localStorage.getItem('user')){
                          await dispatch(addToCart({ productId: ele._id})).unwrap();
                        }else{
                          toast.error("You have to login first!");
                        }
                      }}
                      >{isCart? "Already Added" : "Add to cart" }</Button>
                    </Box>
                  </Card>
                </Box>
              </div>
            );
          })}
        </Slider>
      </div>
    </>
  )
}

export default Products