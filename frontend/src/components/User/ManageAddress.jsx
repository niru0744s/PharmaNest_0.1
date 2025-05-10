import React, { useState } from "react";
import { IconButton, TextField, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./UserProfile.css";

const initialAddresses = [
  {
    id: 1,
    name: "NIRUPAM BHATTACHARYA",
    phone: "7439893394",
    address: "M18, Sreenagar West, Sreenagar, Panchpota Mauza, Kolkata, West Bengal - 700094",
    type: "HOME",
  },
  {
    id: 2,
    name: "Swarnalika Guha",
    phone: "8617759533",
    address: "M-4, Sreenagar West, Sreenagar, Panchpota Mauza, Kolkata, West Bengal - 700094",
    type: "HOME",
  },
];

const ManageAddress = () => {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [editingId, setEditingId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newAddress, setNewAddress] = useState(null);

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setEditingId(id);
  };

  const handleEdit = () => {
    setAnchorEl(null);
    // Editing is already handled in state
  };

  const handleSave = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => (addr.id === id ? newAddress : addr))
    );
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setNewAddress(null);
  };

  return (
    <div className="card p-4 mt-3">
      <h5>Manage Addresses</h5>

      <div className="add-new-address mb-3">
        <button className="btn btn-outline-primary w-100 text-start">
          + ADD A NEW ADDRESS
        </button>
      </div>

      {addresses.map((addr) => (
        <div key={addr.id} className="address-card p-3 mb-3">
          {editingId === addr.id ? (
            <>
              <div className="d-flex gap-2 mb-2">
                <TextField
                  label="Name"
                  size="small"
                  fullWidth
                  defaultValue={addr.name}
                  onChange={(e) =>
                    setNewAddress({ ...addr, name: e.target.value })
                  }
                />
                <TextField
                  label="Phone"
                  size="small"
                  fullWidth
                  defaultValue={addr.phone}
                  onChange={(e) =>
                    setNewAddress({ ...addr, phone: e.target.value })
                  }
                />
              </div>
              <TextField
                label="Address"
                fullWidth
                size="small"
                defaultValue={addr.address}
                onChange={(e) =>
                  setNewAddress({ ...addr, address: e.target.value })
                }
              />
              <div className="d-flex justify-content-end gap-2 mt-2">
  <button
    className="btn btn-sm btn-outline-secondary"
    onClick={handleCancel}
  >
    Cancel
  </button>
  <button
    className="btn btn-sm btn-success"
    onClick={() => handleSave(addr.id)}
  >
    Save
  </button>
</div>
            </>
          ) : (
            <>
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{addr.name}</strong> &nbsp; {addr.phone}
                  <div className="text-muted mt-1">{addr.address}</div>
                </div>
                <IconButton onClick={(e) => handleMenuOpen(e, addr.id)}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </div>
              <Menu
                anchorEl={anchorEl}
                open={editingId === addr.id}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem disabled>Delete</MenuItem>
              </Menu>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ManageAddress;
