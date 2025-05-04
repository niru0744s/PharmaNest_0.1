import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import {Link} from 'react-router-dom';
import Navbar from '../Header&Footer/Navbar';
import Footer from '../Header&Footer/Footer';

export default function Signup() {
  return (
    <>
    <Navbar/>
    <div className="container m-5">
      <div className="row" style={{height:"36rem"}}>
        <div className="col-2"></div>
        <div className="col-3 bg-primary d-flex align-items-start flex-column" style={{color:"white"}}>
          <p className="fw-bold fs-3 card-title ms-5 mt-4"> Loooks like you're new here</p>
          <p className="ms-5 mt-3">Signup with your email and get started</p>
          <img src="media/images/log.png" alt="" style={{height:"12rem",width:"13rem"}} className="ms-5 mt-auto" />
        </div>
        <div className="col-5 bg-light d-flex align-items-start flex-column">
          <form action="">
          <Box
          sx={{ '& > :not(style)': { m: 5, mt:10, width: '45ch' } }}
          noValidate
          autoComplete="off"
        >
      <TextField id="standard-basic" label="Enter Email" variant="standard" className='ms-5' />
        </Box>
        <p className='ms-5' style={{fontSize:"0.8rem"}}>By Continuning, you agree to PharmaNest's <a className='link text-decoration-none'>Terms of Use</a> and <a className='link text-decoration-none'>Privacy Policy</a> </p>

        <Stack direction="row" sx={{mt:3}} className='ms-5'>
          <Button variant="contained" sx={{textTransform: "none"}} color="warning" style={{width:"90%"}}>Continue</Button>
        </Stack>
          </form>
          <Stack direction="row" sx={{mt:2 , textTransform: "none" , width:'50ch'}} className='ms-5'>
          <Link style={{display:"block",width:"100%"}} to={"/login"}><Button variant="contained" sx={{textTransform: "none"}} style={{width:"90%"}}>Existing User? Log in </Button></Link>
        </Stack>
        </div>
      </div>      
    </div>
    <Footer/>
    </>
  )
}
