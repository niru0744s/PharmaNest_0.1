import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ProfileInfo from "./ProfileInfo";
import "./UserProfile.css";
import Navbar from "../Header&Footer/Navbar";

const UserProfile = () => {
  const [section, setSection] = useState("profile");

  return (
    <>
    <div className="container-fluid user-profile-page">
      <div className="row">
        <div className="col-md-3 sidebar-container">
          <Sidebar setSection={setSection} section={section} />
        </div>
        <div className="col-md-9">
          {section === "profile" && <ProfileInfo />}
          {/* Add more sections like <ManageAddress /> etc */}
        </div>
      </div>
    </div>
    </>
  );
};

export default UserProfile;
