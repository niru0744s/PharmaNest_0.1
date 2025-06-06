import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ProfileInfo from "./ProfileInfo";
import "./UserProfile.css";
import { useDispatch, useSelector } from "react-redux";
import ManageAddress from "./ManageAddress";
import { useEffect } from "react";
import { fetchAddress } from "../../features/dataSlice";
import { toast } from "react-toastify";

export default function UserDashboard() {
  const [section, setSection] = useState(["section","manageAddress"]);
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(()=>{
    if(user){
      dispatch(fetchAddress());
    }else{
      toast.error("You have to login first.")
    }
  })
  return (
    <div className="container-fluid user-profile-page">
      <div className="row">
        <div className="col-md-3 sidebar-container">
          <Sidebar setSection={setSection} section={section} user={user}/>
        </div>
        <div className="col-md-9">
          {section === "profile" && <ProfileInfo />}
          {section === "manageAddress" && <ManageAddress/>}
        </div>
      </div>
    </div>
  );
}