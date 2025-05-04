import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import {Link} from 'react-router-dom'
import Navbar from '../Header&Footer/Navbar';
import Footer from '../Header&Footer/Footer';

export default function Cart({city="kolkata", pin="700090"}) {
  return (
    <>
    <Navbar/>
      <div className="container">
        <div className="row my-5 mx-2 ">
          <div className="col-7 m-1">
            <div className='bg-light mb-3 d-flex justify-content-evenly align-items-center' style={{height:"3.5rem"}}>
              <p className='fs-6 fw-bold mt-3'>Delivery to: {city} - {pin}</p>
              <Stack spacing={2} direction="row">
              <Link><Button variant="outlined">Change</Button></Link>
              </Stack>
            </div>
            <LeftSidebar/>
            <LeftSidebar/>
            <LeftSidebar/>
            <div className="row mx-0 bg-light shadow-lg rounded-2 d-flex justify-content-end" style={{height:"8rem"}}>
            <Stack direction="row" sx={{ width: '100%', justifyContent: 'flex-end', alignItems: 'center', pr: 3 }}>
              <Button variant="contained" sx={{
              textTransform: "none",
              width: "200px",
              height: "45px",
              fontWeight: "bold",
              }}
              color="warning">Place Order</Button>
            </Stack>
            </div>
          </div>
          <div className="col-4 m-1" style={{height:"30rem"}}>
            <RightSidebar count={1} total={200} discount={0}/>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  )
}
