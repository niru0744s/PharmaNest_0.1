import React, { useState } from "react";
import "./MyOrders.css";
import { TextField, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";


const ordersData = [
  {
    id: 1,
    title: "Boult Pyro Rotating Bezel, 1.43\" AMOLED",
    color: "Gunmetal",
    size: "36.322",
    price: "₹2,508",
    status: "Delivered",
    date: "Apr 05",
    img: "media/headerImg/img1.png",
  },
  {
    id: 2,
    title: "PROWL by Tiger Shroff Adjustable Strength Grip",
    color: "Grey",
    price: "₹167",
    status: "Delivered",
    date: "Oct 14, 2024",
    img: "media/headerImg/img1.png",
  },
  {
    id: 3,
    title: "REVEL RVL-38C-LGP-BK Acoustic Guitar",
    color: "Black",
    price: "₹1,587 + 🪙125",
    status: "Delivered",
    date: "Oct 04, 2024",
    img: "media/headerImg/img1.png",
  },
  {
    id: 4,
    title: "ZEBRONICS ZEB-BRO, With In-Line MiC",
    color: "Black",
    price: "₹206",
    status: "Refund Cancelled",
    date: "",
    img: "media/headerImg/img1.png",
  },
];

const MyOrders = () => {
  const [search, setSearch] = useState("");

  const filteredOrders = ordersData.filter(order =>
    order.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3">
          <div className="card p-3 filters">
            <h6 className="mb-3">Filters</h6>

            <strong>ORDER STATUS</strong>
            {["On the way", "Delivered", "Cancelled", "Returned"].map((status, i) => (
              <div key={i} className="form-check">
                <input className="form-check-input" type="checkbox" />
                <label className="form-check-label">{status}</label>
              </div>
            ))}

            <hr />

            <strong>ORDER TIME</strong>
            {["Last 30 days", "2024", "2023", "2022", "2021", "Older"].map((time, i) => (
              <div key={i} className="form-check">
                <input className="form-check-input" type="checkbox" />
                <label className="form-check-label">{time}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Main section */}
        <div className="col-md-9">
        <div className="d-flex mb-3 align-items-center gap-2">
  <TextField
    fullWidth
    label="Search your orders"
    variant="outlined"
    size="small"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
  <Button
  variant="contained"
  color="primary"
  size="medium"
  sx={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 1 }}
>
  <SearchIcon fontSize="small" />
  Search
</Button>
</div>

          {filteredOrders.map(order => (
            <div key={order.id} className="card p-3 mb-3 d-flex flex-row align-items-center order-item">
              <img src={order.img} alt={order.title} width="80" className="me-3" />
              <div className="flex-grow-1">
                <h6 className="mb-1">{order.title}</h6>
                {order.color && <small>Color: {order.color}</small>}
                {order.size && <small className="ms-3">Size: {order.size}</small>}
                <div className="fw-semibold mt-2">{order.price}</div>
              </div>
              <div className="text-end">
                <div className={`status-dot ${order.status.toLowerCase().includes("delivered") ? "green" : "gray"}`}></div>
                <div className="fw-semibold">{order.status} {order.date && `on ${order.date}`}</div>
                <div className="text-muted small">Your item has been delivered</div>
                <div className="text-primary mt-1 fw-medium cursor-pointer">★ Rate & Review Product</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
