import React, { useState } from "react";
import "./MegaMenu.css";

const MegaMenu = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="position-relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="text-primary fw-bold d-flex align-items-center gap-1 cursor-pointer">
        TVs & Appliances
        <span className="dropdown-arrow">▾</span>
      </div>

      {isHovered && (
        <div className="mega-menu shadow">
          <div className="row">
            <div className="col">
              <h6>Television</h6>
              <p>New Launches</p>
              <p>Smart & Ultra HD</p>
              <h6 className="mt-3">Top Brands</h6>
              <p>Mi</p>
              <p>Vu</p>
              <p>Thomson</p>
              <p>Samsung</p>
              <p>iFFALCON by TCL</p>
              <p>Nokia</p>
              <p>LG</p>
              <p>realme</p>
              <p>Motorola</p>
              <h6>Shop by Screen Size</h6>
              <p>24 & below</p>
              <p>28 - 32</p>
              <p>39 - 43</p>
              <p>48 - 55</p>
              <p>60 & above</p>
            </div>

            <div className="col">
              <h6>Washing Machine</h6>
              <p>Fully Automatic Front Load</p>
              <p>Semi Automatic Top Load</p>
              <p>Fully Automatic Top Load</p>

              <h6 className="mt-3">Air Conditioners</h6>
              <p>Inverter AC</p>
              <p>Split ACs</p>
              <p>Window ACs</p>

              <h6 className="mt-3">Shop By Brand</h6>
              <p>LG</p>
              <p>Hitachi</p>
              <p>Carrier</p>

              <h6 className="mt-3">Refrigerators</h6>
              <p>Single Door</p>
              <p>Double Door</p>
              <p>Triple door</p>
              <p>Side by Side</p>
              <p>Convertible</p>
            </div>

            <div className="col">
              <h6>Kitchen Appliances</h6>
              <p>Microwave Ovens</p>
              <p>OTG</p>
              <p>Juicer/Mixer/Grinder</p>
              <p>Electric Kettle</p>
              <p>Induction Cooktops</p>
              <p>Chimneys</p>
              <p>Hand Blenders</p>
              <p>Sandwich Makers</p>
              <p>Pop Up Toasters</p>
              <p>Electric Cookers</p>
              <p>Wet Grinders</p>
              <p>Food Processors</p>
              <p>Coffee Makers</p>
              <p>Dishwashers</p>
              <h6>Healthy Living Appliances</h6>
            </div>

            <div className="col">
              <h6>Small Home Appliances</h6>
              <p>Irons</p>
              <p>Water Purifiers</p>
              <p>Fans</p>
              <p>Air Coolers</p>
              <p>Inverters</p>
              <p>Vacuum Cleaners</p>
              <p>Sewing Machines</p>
              <p>Voltage Stabilizers</p>
              <p>Water Geysers</p>
              <p>Immersion Rods</p>

              <h6 className="mt-3">Top Brands</h6>
              <p>Livpure</p>
              <p>Philips</p>
              <p>Bajaj</p>
              <p>IFB</p>
              <p>Eureka Forbes</p>
              <p>Kaff</p>
            </div>

            <div className="col">
              <h6>Buying Guides</h6>
              <p>Televisions</p>
              <p>Washing Machines</p>
              <p>Refrigerators</p>
              <p>Air Conditioners</p>
              <p>Water Purifiers</p>
              <p>Air Purifiers</p>
              <p>Chimneys</p>
              <p>Water Geysers</p>

              <h6 className="mt-3">New Launches</h6>
              <p>Coocaa Smart TVs</p>
              <p>Nokia (55) 4K</p>
              <p>Mi (32) 4A</p>
              <p>MarQ (43) FHD</p>
              <p>LG Refrigerators</p>
              <p>Thomson (40)</p>
              <p>Whirlpool Refrigerators</p>
              <p>Kodak (22) | (32)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MegaMenu;
