import React from 'react'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import BoltIcon from '@mui/icons-material/Bolt';

export default function ProductDetails() {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  return (
    <div className='container bg-light mt-5'>
      <div className="row mt-5">
        <div className="col-3 position-relative mt-4" style={{height:"25rem"}}>
        <Checkbox {...label} icon={<FavoriteBorder />} checkedIcon={<Favorite />} className='position-absolute top-0 end-0 p-0 mt-2'/>
        <img src="media/headerImg/img1.png" alt="" style={{height:"80%" , width:"90%"}} className='p-0 m-0'/>
        <Stack direction="row" spacing={2}>
        <Button variant="contained" color="success">
          <AddShoppingCartIcon/>
           Add To cart
        </Button>
        <Button variant="contained" color="info" sx={{height:"3rem"}}>
          <BoltIcon/>
           Buy Now
        </Button>
        </Stack>
        </div>
        <div className="col-8 container mt-3">
        <h3 className="fw-bold">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia eligendi aspernatur molestiae ab harum amet earum non est adipisci commodi similique ratione nesciunt, repellendus magni nam consequatur sit itaque cum.
      </h3>
      <p className="text-secondary">(Jet Black Strap, Regular)</p>

      <div className="d-flex align-items-center mb-2">
        <span className="badge bg-success me-2">4.1 ★</span>
        <span>7,31,021 Ratings & 40,745 Reviews</span>
      </div>
      <h2 className="text-success fw-bold">₹1,199 <small className="text-decoration-line-through text-muted fs-5">₹5,999</small> <span className="text-success fs-5">80% off</span></h2>
      <p className="text-muted">Secure delivery in 2 Days</p>
      <p>Or Pay <strong>₹1,149</strong> + <span className="text-warning">50 🪙</span></p>
        </div>
      </div>
    </div>
  )
}
