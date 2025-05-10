import React, { useState } from "react";
import "./MegaMenu.css"; // Same file as earlier for dropdown styling
import MegaMenu from "./MegaMenu"; // For TVs & Appliances (you can create similar ones for others)

const menuItems = [
  { label: "Electronics", hasMegaMenu: true },
  { label: "TVs & Appliances", hasMegaMenu: true },
  { label: "Men", hasMegaMenu: false },
  { label: "Women", hasMegaMenu: false },
  { label: "Baby & Kids", hasMegaMenu: false },
  { label: "Home & Furniture", hasMegaMenu: false },
  { label: "Sports, Books & More", hasMegaMenu: false },
  { label: "Flights", hasMegaMenu: false },
  { label: "Offer Zone", hasMegaMenu: false },
  { label: "Grocery", hasMegaMenu: false }
];

const NavbarMenu = () => {
  const [hovered, setHovered] = useState("");

  return (
    <div className="d-flex px-4 py-2 border-bottom bg-white">
      {menuItems.map((item, idx) => (
        <div
          key={idx}
          className="position-relative px-3 fw-medium text-dark menu-item"
          onMouseEnter={() => setHovered(item.label)}
          onMouseLeave={() => setHovered("")}
        >
          <span className="cursor-pointer d-flex align-items-center">
            {item.label}
            {item.hasMegaMenu && <span className="dropdown-arrow ms-1">▾</span>}
          </span>

          {item.hasMegaMenu && hovered === item.label && (
            <div className="position-absolute w-100 top-100 start-0">
              {/* Use different mega menus based on item.label if needed */}
              <MegaMenu />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NavbarMenu;
