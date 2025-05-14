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
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { updateWishlist } from "../../features/productActionSlice";

const Products = ({ data }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.productActions.wishlist);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
  };
  return (
    <>
      <div
        className="bg-light m-2 p-3 rounded"
        style={{ position: "relative", minHeight: "22rem" }}
      >
        <h3 className="ms-2 mb-3">{data?.category}</h3>

        <Slider {...settings}>
          {data?.products?.map((ele, idx) => {
            const isLiked = wishlist.includes(ele._id);

            return (
              <div className="" key={idx}>
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

                    {/* Product Image */}
                    <CardMedia
                      component="img"
                      height="150"
                      image={ele.imageUrl?.url}
                      alt={ele.name}
                      sx={{ objectFit: "contain", mb: 1 }}
                    />

                    {/* Product Info */}
                    <CardContent className="text-center">
                      <Typography variant="body1" className="mb-1">
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
              </div>

            );
          })}
        </Slider>
      </div>
    </>
  )
}

export default Products