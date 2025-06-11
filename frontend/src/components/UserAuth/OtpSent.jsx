import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { submitCredentials, submitOtp } from '../../features/signupSlice';
import { useState } from 'react';
import { toast } from 'react-toastify';
export default function OtpSent() {

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: ""
  })

  const handleInput = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Please enter the email");
      return;
    }

    try {
      await dispatch(submitOtp(formData)).unwrap();
      setFormData({ email: "" })
    } catch (error) {
      toast.error(error);
    }
  }
  return (
    <div className="w-100 px-3 d-flex flex-column align-items-center">
  <Box
    component="form"
    onSubmit={handleSubmit}
    noValidate
    autoComplete="off"
    sx={{ width: '100%', maxWidth: '500px', mt: 6 }}
  >
    {/* Email Field */}
    <TextField
      id="standard-basic"
      label="Enter Email"
      type="email"
      name="email"
      variant="standard"
      autoComplete='on'
      value={formData.email}
      onChange={handleInput}
      required
      fullWidth
    />

    {/* Terms Text */}
    <p className='mt-4' style={{ fontSize: "0.8rem" }}>
      By Continuing, you agree to PharmaNest's{' '}
      <a className='link text-decoration-none'>Terms of Use</a> and{' '}
      <a className='link text-decoration-none'>Privacy Policy</a>
    </p>

    {/* Continue Button */}
    <Button
      variant="contained"
      color="warning"
      type="submit"
      fullWidth
      sx={{ textTransform: 'none', mt: 3 }}
    >
      Continue
    </Button>
    {/* Existing User Button */}
    <Link to="/login" style={{ textDecoration: 'none' }}>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ textTransform: 'none', mt: 2 }}
      >
        Existing User? Log in
      </Button>
    </Link>
  </Box>
</div>
  )
}
