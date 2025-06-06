import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginHost } from '../../../features/hostLoginSlices';
import { Container ,Box, TextField, FormControl, InputLabel, Input, InputAdornment, IconButton, Button , Stack } from '@mui/material';
import { useNavigate , Link } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify';
import HostNavbar from '../LandingPage/HostNavbar';
import HostFooter from '../LandingPage/HostFooter';


export default function HostLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData , setFormData] = useState({
    email:"",
    password:""
  });
  const { status, error } = useSelector((state) => state.loginHost.status);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  const handleInput = (e)=>{
    setFormData({...formData , [e.target.name]:e.target.value});
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.email || !formData.password){
      toast.error("Please fill the require input !");
    }

    try {
     await dispatch(loginHost(formData)).unwrap();
     setFormData({email:"",password:""}); 
     navigate("/sellerDashboard");
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <>
    <HostNavbar/>
     <div className='container m-5'>
     <div className="row" style={{ height: "36rem" }}>
        <div className="col-2"></div>
          <div className="col-3 bg-primary d-flex align-items-start flex-column" style={{ color: "white" }}>
            <p className="fw-bold fs-3 card-title ms-5 mt-4"> Host Login </p>
            <p className="ms-5 mt-3">Get access to your Products, <br /> Sales & Many more... </p>
            <img src="/media/images/log.png" alt="" style={{ height: "12rem", width: "13rem" }} className="ms-5 mt-auto" />
          </div>
      <div className="col-5 bg-light d-flex align-items-start flex-column">
            <Box
              sx={{ '& > :not(style)': { width: '40ch' } }}
              noValidate
              autoComplete="off"
              component="form"
              onSubmit={handleSubmit}
            >
              <TextField id="standard-basic" type='email' label="Enter Email" variant="standard" value={formData.email} name='email' onChange={handleInput} sx={{ width: '30ch', mt: 15 }} className='ms-5' />
              <FormControl variant="standard" required sx={{
                width: "100%"
              }}>
                <InputLabel htmlFor="password" className='ms-5'>Password</InputLabel>
                <Input
                  id="password"
                  className='ms-5'
                  name="password"
                  sx={{ width: "100%" }}
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInput}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        aria-label={showPassword ? 'hide password' : 'show password'}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <p className='ms-5 mt-5' style={{ fontSize: "0.8rem" }}>By Continuning, you agree to PharmaNest's <a className='link text-decoration-none'>Terms of Use</a> and <a className='link text-decoration-none'>Privacy Policy</a> </p>
              <Stack direction="row" className='ms-5 mt-3'>
                <Button variant="contained" color="warning" type='submit' style={{ width: "100%" }}>Login</Button>
              </Stack>
            </Box>
            <Link className='text-decoration-none mt-auto align-self-center mb-5 fw-bold' style={{ fontSize: "0.8rem" }} to="/hostSignup" >New to product sell? Create an Account</Link>
          </div>
      </div>
    </div>
    <HostFooter/>
    </>
  );
}
