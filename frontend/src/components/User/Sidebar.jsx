import React from "react";
import {
  AccountCircle,
  CreditCard,
  Home,
  Folder,
  Logout,
  Person,
  LocationOn,
  ContactPage,
  Notifications,
  Favorite,
  Reviews,
  HelpOutline,
  TrackChanges,
} from "@mui/icons-material";
import "./userProfile.css";

const Sidebar = ({ section, setSection , user }) => {
  return (
    <div className="sidebar-wrapper p-3">
      {/* User Greeting */}
      <div className="d-flex align-items-center mb-4 bg-light p-3 ">
        <img
          src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
          className="rounded-circle me-2"
          width="50"
        />
        <div>
          <small>Hello,</small>
          <h6 className="mb-0 fw-bold">{user.firstName}</h6>
        </div>
      </div>

      {/* MY ORDERS */}
      <div className="sidebar-block border bg-light p-3 m-0">
        <div className="sidebar-title">
          <Home fontSize="small" className="me-2" />
          MY ORDERS
        </div>
      </div>

      {/* ACCOUNT SETTINGS */}
      <div className="sidebar-block border bg-light m-0 p-3">
        <div className="sidebar-title">
          <AccountCircle fontSize="small" className="me-2" />
          ACCOUNT SETTINGS
        </div>
        <p onClick={() => setSection("profile")} className={section === "profile" ? "actv-link" : ""}>
          <Person fontSize="medium" className="me-2" />
          Profile Information
        </p>
        <p onClick={() => setSection("manageAddress")} className={section === "manageAddress" ? "actv-link" : ""}>
          <LocationOn fontSize="medium" className="me-2" />
          Manage Addresses
        </p>
        <p>
          <ContactPage fontSize="medium" className="me-2" />
          PAN Card Information
        </p>
      </div>

      {/* PAYMENTS */}
      <div className="sidebar-block m-0 bg-light border p-3">
        <div className="sidebar-title">
          <CreditCard fontSize="small" className="me-2" />
          PAYMENTS
        </div>
        <p>Gift Cards <span className="text-success">₹0</span></p>
        <p>Saved UPI</p>
        <p>Saved Cards</p>
      </div>

      {/* MY STUFF */}
      <div className="sidebar-block m-0 bg-light border p-3">
        <div className="sidebar-title">
          <Folder fontSize="small" className="me-2" />
          MY STUFF
        </div>
        <p><Reviews fontSize="small" className="me-2" /> My Coupons</p>
        <p><Reviews fontSize="small" className="me-2" /> My Reviews & Ratings</p>
        <p><Notifications fontSize="small" className="me-2" /> All Notifications</p>
        <p><Favorite fontSize="small" className="me-2" /> My Wishlist</p>
      </div>

      {/* LOGOUT */}
      <div className="sidebar-block border-top pt-3 mt-3">
        <div className="sidebar-title m-0 bg-light border p-3">
          <Logout fontSize="small" className="me-2" />
          Logout
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
