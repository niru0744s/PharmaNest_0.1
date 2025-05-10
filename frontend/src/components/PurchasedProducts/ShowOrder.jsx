import React from "react";
import "./MyOrders.css";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const ShowOrder = ({ order }) => {
  const {
    title,
    image,
    price,
    color,
    size,
    statusTimeline,
    shipping,
    priceBreakdown,
    rating
  } = order;

  return (
    <div className="container row m-5">
      <div className="col-md-8 card p-4">
        <div className="d-flex">
          <img src={image} alt={title} width={100} className="me-3" />
          <div>
            <h6>{title}</h6>
            <p className="text-muted">{size}, {color}</p>
            <p className="fw-bold">₹{price}</p>
          </div>
        </div>

        <div className="alert alert-secondary mt-3 py-2 small">
          📦 Item was opened and verified at the time of delivery.
        </div>

        <ul className="timeline mt-3 ps-3">
          {statusTimeline.map((step, i) => (
            <li key={i}>
              <span className="text-success">✔</span> {step.label}, <strong>{step.date}</strong>
            </li>
          ))}
        </ul>

        <p className="text-primary small cursor-pointer">See All Updates →</p>
        <p className="text-muted small">Return policy ended on {order.returnPolicyEnd}</p>

        <div className="d-flex align-items-center gap-1 mt-3">
          {[...Array(5)].map((_, i) =>
            i < rating ? <StarIcon color="success" key={i} /> : <StarBorderIcon key={i} />
          )}
          <button className="btn btn-outline-secondary btn-sm ms-3">
            📷 Add Review
          </button>
        </div>

        <div className="mt-3 text-secondary small">💬 Chat with us</div>
      </div>

      {/* RIGHT: SHIPPING & PRICING SECTION */}
      <div className="col-md-4 ps-md-4 mt-4 mt-md-0">
        <div className="card p-3 mb-3">
          <h6>📄 Invoice download</h6>
        </div>

        <div className="card p-3 mb-3">
          <h6>Shipping details</h6>
          <p className="fw-semibold mb-0">{shipping.name}</p>
          <p className="small mb-0">{shipping.address}</p>
          <p className="small text-muted mb-0">Phone number: {shipping.phone}</p>
        </div>

        <div className="card p-3">
          <h6>Price Details</h6>
          <ul className="list-unstyled small">
            {priceBreakdown.map((item, i) => (
              <li key={i} className="d-flex justify-content-between">
                <span>{item.label}</span>
                <span className={item.strike ? "text-decoration-line-through" : ""}>
                  {item.value}
                </span>
              </li>
            ))}
            <li className="d-flex justify-content-between fw-bold pt-2 border-top mt-2">
              <span>Total Amount</span>
              <span>₹{price}</span>
            </li>
            <li className="small text-muted mt-2">• UPI: ₹{price}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShowOrder;
