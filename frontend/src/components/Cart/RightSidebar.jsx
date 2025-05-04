import React, { useState } from 'react'

export default function RightSidebar({count = 3, total = 82888, discount = 20369}) {
    const [delivery , setDelivery] = useState(false);
    const res = (total-discount)-(30+42);
  return (
    <div className="border rounded p-3 bg-white shadow-sm">
      <h5 className="mb-3">PRICE DETAILS</h5>
      <hr />
      <div className="d-flex justify-content-between mb-2">
        <span>Price ({count} items)</span>
        <span>₹{total.toLocaleString()}</span>
      </div>
      <div className="d-flex justify-content-between text-success mb-2">
        <span>Discount</span>
        <span>- ₹{discount.toLocaleString()}</span>
      </div>
      <div className="d-flex justify-content-between text-success mb-2">
        <span>Buy more &amp; save more</span>
        <span>- ₹30</span>
      </div>
      <div className="d-flex justify-content-between text-success mb-2">
        <span>Coupons for you</span>
        <span>- ₹42</span>
      </div>
      <div className="d-flex justify-content-between mb-2">
        <span>Delivery Charges</span>
        <span><s className="text-muted">₹100</s> <span className="text-success">Free</span></span>
      </div>
      <hr />
      <div className="d-flex justify-content-between fw-bold mb-2">
        <span>Total Amount</span>
        <span>₹{(res).toLocaleString()}</span>
      </div>
      <div className="text-success fw-semibold" style={{ fontSize: '0.9rem' }}>
        You will save ₹{(total - res).toLocaleString()} on this order
      </div>
    </div>
  )
}
