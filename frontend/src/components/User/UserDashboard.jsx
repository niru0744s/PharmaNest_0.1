import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ProfileInfo from "./ProfileInfo";
import "./UserProfile.css";
import { useSelector } from "react-redux";
import ManageAddress from "./ManageAddress";

export default function UserDashboard() {
  const [section, setSection] = useState(["section","manageAddress"]);
  const user = useSelector((state)=>state.login.user)
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