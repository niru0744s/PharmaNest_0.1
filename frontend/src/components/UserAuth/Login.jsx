import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import {Link} from 'react-router-dom';
import Navbar from '../Header&Footer/Navbar';
import Footer from '../Header&Footer/Footer';

export default function Login() {
  return (
    <>
    <Navbar/>
    <div className="container m-5">
      <div className="row" style={{height:"36rem"}}>
        <div className="col-2"></div>
        <div className="col-3 bg-primary d-flex align-items-start flex-column" style={{color:"white"}}>
          <p className="fw-bold fs-3 card-title ms-5 mt-4"> Login </p>
          <p className="ms-5 mt-3">Get access to your Orders, <br /> Wishlist and Recommendations </p>
          <img src="media/images/log.png" alt="" style={{height:"12rem",width:"13rem"}} className="ms-5 mt-auto" />
        </div>
        <div className="col-5 bg-light d-flex align-items-start flex-column">
          <form action="">
          <Box
          sx={{ '& > :not(style)': { m: 5, mt:9, width: '50ch' } }}
          noValidate
          autoComplete="off"
        >
      <TextField id="standard-basic" label="Enter Email" variant="standard" />
        </Box>
        <p className='ms-5' style={{fontSize:"0.8rem"}}>By Continuning, you agree to PharmaNest's <a className='link text-decoration-none'>Terms of Use</a> and <a className='link text-decoration-none'>Privacy Policy</a> </p>

        <Stack direction="row" sx={{mt:3}} className='ms-5'>
          <Button variant="contained" color="warning" style={{width:"90%"}}>Request OTP</Button>
        </Stack>
          </form>
          <Link className='text-decoration-none mt-auto align-self-center mb-5 fw-bold' style={{fontSize:"0.8rem"}} to="/signup" >New to PharmaNest? Create an Account</Link>
        </div>
      </div>      
    </div>
    <Footer/>
    </>
  )
}
