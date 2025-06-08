import React from "react";
import { useSelector } from "react-redux";
import { Card, Typography, Box, Button } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/Star";
import { useDispatch } from "react-redux";
import { cancelOrder } from "../../features/productActionSlice";

const ShowOrder = () => {
  const orders = useSelector((state) => state.productActions.purchases); // Adjust slice name
  const dispatch = useDispatch();
  return (
    <div className="container mt-4">
      {orders.map((order, i) => (
        <div key={i} className="row mb-5">
          {/* LEFT PRODUCT BLOCK */}
          <div className="col-md-8 card p-4">
            {order.products.map((item, index) => (
              <Box key={index} className="d-flex mb-3">
                <img
                  src={item.product.imageUrl.url}
                  alt={item.product.name}
                  width={100}
                  className="me-3"
                />
                <div>
                  <Typography variant="subtitle1">{item.product.name}</Typography>
                  <Typography variant="body2" className="text-muted">
                    {item.product.brand}, {item.product.category}
                  </Typography>
                  <Typography variant="subtitle2" className="fw-bold">
                    ₹{item.product.price}
                  </Typography>
                </div>
              </Box>
            ))}

            <div className="alert alert-secondary mt-3 py-2 small">
              📦 Item was opened and verified at the time of delivery.
            </div>

            <ul className="timeline mt-3 ps-3">
              {order.status === "pending" && (
                <li>
                  <span className="text-success">✔</span> Order placed at:
                  <strong>{new Date(order.createdAt).toLocaleString('en-IN')}</strong>
                </li>
              )}

              {order.status === "shipped" && (
                <li>
                  <span className="text-success">✔</span> Order Shipped at:
                  <strong>{new Date(order.updatedAt).toLocaleString('en-IN')}</strong>
                </li>
              )}

              {order.status === "on_the_way" && (
                <li>
                  <span className="text-success">✔</span> Order Out for delivery at:
                  <strong>{new Date(order.updatedAt).toLocaleString('en-IN')}</strong>
                </li>
              )}

              {order.status === "delivered" && (
                <li>
                  <span className="text-success">✔</span> Order Delivered at:
                  <strong>{new Date(order.updatedAt).toLocaleString('en-IN')}</strong>
                </li>
              )}

              {order.status === "cancelled" && (
                <li>
                  <span className="text-success">✔</span> Order Cancelled at:
                  <strong>{new Date(order.updatedAt).toLocaleString('en-IN')}</strong>
                </li>
              )}
            </ul>

            <p className="text-primary small cursor-pointer">See All Updates →</p>
            <p className="text-muted small">Return policy ended on Apr 12</p>

            <div className="d-flex align-items-center gap-1 mt-3">
              {[...Array(4)].map((_, i) => (
                <StarIcon color="success" key={i} />
              ))}
              <StarBorderIcon />
              <Button
                variant="outlined"
                size="small"
                className="ms-3"
              >
                📷 Add Review
              </Button>
            </div>

            <div className="mt-3 text-secondary small">
              <Button
                variant="outlined"
                color="error"
                size="small"
                disabled={order.status === "delivered" || order.status === "cancelled"}
                onClick={() => dispatch(cancelOrder(order._id))} // Use Redux thunk
              >
                {order.status == "cancelled" ? ("order cancelled") : ("cancel order")}
              </Button>
            </div>
          </div>

          {/* RIGHT PRICE + SHIPPING BLOCK */}
          <div className="col-md-4 ps-md-4 mt-4 mt-md-0">
            <Card className="p-3 mb-3">
              <Typography variant="subtitle1">📄 Invoice download</Typography>
            </Card>

            <Card className="p-3 mb-3">
              <Typography variant="subtitle1">Shipping details</Typography>
              <Typography variant="body2" className="fw-semibold mb-0">
                {order.address.name}
              </Typography>
              <Typography variant="body2">{order.address.address}</Typography>
              <Typography variant="body2" className="text-muted">
                Phone number: {order.address.mobileNum}
              </Typography>
            </Card>

            <Card className="p-3">
              <Typography variant="subtitle1">Price Details</Typography>
              <ul className="list-unstyled small">
                <li className="d-flex justify-content-between">
                  <span>List price</span>
                  <span>₹7,999</span>
                </li>
                <li className="d-flex justify-content-between">
                  <span>Selling price</span>
                  <span>₹7,999</span>
                </li>
                <li className="d-flex justify-content-between">
                  <span>Extra Discount</span>
                  <span className="text-danger">-₹5,500</span>
                </li>
                <li className="d-flex justify-content-between">
                  <span>Special Price</span>
                  <span>₹2,499</span>
                </li>
                <li className="d-flex justify-content-between">
                  <span>Delivery Charge</span>
                  <span>Free</span>
                </li>
                <li className="d-flex justify-content-between">
                  <span>Protect Promise Fee</span>
                  <span>₹9</span>
                </li>
                <li className="d-flex justify-content-between fw-bold pt-2 border-top mt-2">
                  <span>Total Amount</span>
                  <span>₹{order.totalAmount}</span>
                </li>
                <li className="small text-muted mt-2">• UPI: ₹{order.totalAmount}</li>
              </ul>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowOrder;
