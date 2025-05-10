import React, { useEffect, useState } from 'react';
import {
  TextField, Button, MenuItem, Typography, Grid, Paper
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { submitProduct } from '../../../features/ProductSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ProductForm.css';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '', brand: '', form: '', strength: '', category: '',
    mainPrice: '', price: '', description: '', imageUrl: null, quantity: 0
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, error } = useSelector(state => state.product);

  useEffect(() => {
    if (success) navigate('/dashboard');
    if (error) toast.error(error);
  }, [success, error, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'imageUrl' ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      payload.append(key, val);
    });
    dispatch(submitProduct(payload));
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        <Typography variant="h5" className="text-center mb-4" sx={{ fontWeight: 600 }}>
          Add a New Product
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
            {/* 👇 Description moved to its own row */}
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
                  multiple
                  required
                />
              </Button>
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
  );
};

export default ProductForm;
