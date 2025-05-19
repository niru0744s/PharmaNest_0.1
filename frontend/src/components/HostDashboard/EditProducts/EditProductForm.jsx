import { useLocation, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
  TextField, Button, MenuItem, Typography, Grid, Paper
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { editProduct } from '../../../features/ProductSlice';

const categories = [
  "Medicine", "OTC_Medicine", "First_Aid", "Hygiene",
  "Baby_product", "Supplements", "Test_kits"
];

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function EditProductForm() {

    const { state } = useLocation();
    const { id } = useParams(); // optional
    const product = state?.product;
    const [selectedFiles, setSelectedFiles] = useState([]);
    const { success, error } = useSelector(state => state.product);

    const [formData, setFormData] = useState({
        name: product.name, brand: product.brand, form: product.form, strength: product.strength, category: product.category,
        mainPrice: product.mainPrice, price: product.price, description: product.description, imageUrl: null, quantity: product.quantity , p_id: product._id
      });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
    const { name, value, files } = e.target;

  if (name === 'imageUrl') {
    const latestFile = files[files.length - 1]; // Get the last inserted file
    setSelectedFiles([latestFile.name]);

    setFormData((prev) => ({
      ...prev,
      [name]: latestFile, // store just the latest file
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      const payload = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        payload.append(key, val);
      });
      try {
        await dispatch(editProduct({payload , id : product._id}));
        navigate("/sellerProduct");
      } catch (error) {
        toast.error(error);
      }
    };
    
  return (
    <>
      <div className="container">
      <div className="form-wrapper">
        <Typography variant="h5" className="text-center mb-4" sx={{ fontWeight: 600 }}>
          Edit Product
        </Typography>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Grid container spacing={3}>
            <Grid item size={6}>
              <TextField fullWidth label="Product Name" name="name" value={formData.name}
                onChange={handleChange} required className="soft-input" />
            </Grid>
            <Grid item size={6}>
              <TextField fullWidth label="Brand" name="brand" value={formData.brand}
                onChange={handleChange} required className="soft-input" />
            </Grid>
            <Grid item size={6}>
              <TextField fullWidth label="Form" name="form" value={formData.form}
                onChange={handleChange} required className="soft-input" />
            </Grid>

            <Grid item size={6}>
              <TextField fullWidth label="Strength" name="strength" value={formData.strength}
                onChange={handleChange} required className="soft-input" />
            </Grid>
            <Grid item size={4}>
              <TextField fullWidth type="number" label="Quantity" name="quantity" value={formData.quantity}
                onChange={handleChange} className="soft-input" />
            </Grid>
            <Grid item size={4}>
              <TextField fullWidth type="number" label="Main Price" name="mainPrice" value={formData.mainPrice}
                onChange={handleChange} required className="soft-input" />
            </Grid>

            <Grid size={4}>
              <TextField fullWidth type="number" label="Discounted Price" name="price" value={formData.price}
                onChange={handleChange} required className="soft-input" />
            </Grid>
            <Grid item size={6}>
              <TextField
                fullWidth select label="Category" name="category"
                value={formData.category} onChange={handleChange} required className="soft-input"
              >
                <MenuItem value="">Select Category</MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item size={6}>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload files
                <VisuallyHiddenInput
                  type="file"
                  name="imageUrl"
                  onChange={handleChange}
                />
              </Button>
              {selectedFiles.length > 0 && (
                <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                  {selectedFiles.map((name, idx) => (
                    <p className='fs-8' key={idx}>{name}</p>
                  ))}
                </ul>
              )}
            </Grid>

            <Grid item size={12}>
              <TextField fullWidth multiline rows={4} label="Description" name="description"
                value={formData.description} onChange={handleChange} required className="soft-input" />
            </Grid>

            <Grid item xs={12}>
              <div className="d-flex justify-content-center">
                <Button type="submit" variant="contained" size="medium">Submit Product</Button>
              </div>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
    </>
  )
}
