import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  IconButton,
  Button,
  Box,
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { addAddress, deleteAddress } from "../../features/dataSlice"; 

const ManageAddress = () => {
  const dispatch = useDispatch();
  const addresses = useSelector((state) => state.data.address); 

  const [newAddress, setNewAddress] = useState({
    name: "",
    mobileNum: "",
    address: "",
    pincode: ""
  });

  const handleAdd = async () => {
    const { name, mobileNum, address, pincode } = newAddress;
    if (!name || !mobileNum || !address || !pincode) return;
    await dispatch(addAddress(newAddress)).unwrap();
    setNewAddress({ name: "", mobileNum: "", address: "", pincode: "" });
  };

  const handleDelete = (id) => {
    dispatch(deleteAddress(id));
  };

  return (
    <div className="card p-4 mt-3">
      <Typography variant="h6" gutterBottom>Manage Addresses</Typography>

      {/* Add New Address Form */}
      <Box className="p-3 mb-3 border">
        <Box className="d-flex gap-2 mb-2">
          <TextField
            label="Name"
            size="small"
            fullWidth
            value={newAddress.name}
            onChange={(e) =>
              setNewAddress({ ...newAddress, name: e.target.value })
            }
          />
          <TextField
            label="mobileNum"
            size="small"
            fullWidth
            value={newAddress.mobileNum}
            onChange={(e) =>
              setNewAddress({ ...newAddress, mobileNum: e.target.value })
            }
          />
        </Box>
        <Box className="d-flex gap-2 mb-2">
          <TextField
            label="Address"
            size="small"
            fullWidth
            value={newAddress.address}
            onChange={(e) =>
              setNewAddress({ ...newAddress, address: e.target.value })
            }
          />
          <TextField
            label="Pincode"
            size="small"
            fullWidth
            value={newAddress.pincode}
            onChange={(e) =>
              setNewAddress({ ...newAddress, pincode: e.target.value })
            }
          />
        </Box>
        <Box className="d-flex justify-content-end mt-2">
          <Button variant="contained" color="primary" onClick={handleAdd}>
            Add Address
          </Button>
        </Box>
      </Box>

      {/* Show Existing Addresses */}
      {addresses.map((addr) => (
        <Box key={addr._id} className="p-3 mb-3 border d-flex justify-content-between">
          <Box>
            <strong>{addr.name}</strong> &nbsp; {addr.mobileNum}
            <div className="text-muted">{addr.address}</div>
            <div className="text-muted">Pincode: {addr.pincode}</div>
          </Box>
          <IconButton onClick={() => handleDelete(addr._id)}>
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      ))}
    </div>
  );
};

export default ManageAddress;
