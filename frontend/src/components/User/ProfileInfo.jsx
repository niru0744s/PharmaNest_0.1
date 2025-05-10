import React from "react";

const ProfileInfo = () => {
  return (
    <div className="card p-4 mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Personal Information</h5>
        <span className="text-primary cursor-pointer">Edit</span>
      </div>

      <div className="row mb-3">
        <div className="col">
          <input className="form-control" value="Nirupam" disabled />
        </div>
        <div className="col">
          <input className="form-control" value="Bhattacharya" disabled />
        </div>
      </div>

      <div className="mb-3">
        <label className="me-3">Your Gender</label>
        <input type="radio" name="gender" checked /> Male
        <input type="radio" name="gender" className="ms-3" /> Female
      </div>

      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <h6>Email Address</h6>
          <span className="text-primary cursor-pointer">Edit</span>
        </div>
        <input className="form-control" value="nirupambhattacharya100@gmail.com" disabled />
      </div>

      <div>
        <div className="d-flex justify-content-between align-items-center">
          <h6>Mobile Number</h6>
          <span className="text-primary cursor-pointer">Edit</span>
        </div>
        <input className="form-control" value="+917439893394" disabled />
      </div>
    </div>
  );
};

export default ProfileInfo;
