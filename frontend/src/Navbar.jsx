import React from 'react'
import SearchBox from './SearchBox';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CartBadge from './CartBadge';
import './Navbar.css'

export default function Navbar() {
  return (
    <>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid ms-5">
      <img src="media/images/logo2.svg" alt="" style={{height:"4rem",width:"10%" }} />
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <form class="d-flex position-relative ms-5" role="search" style={{width:"40rem"}}>
      <SearchBox/>
      </form>
      <ul class="navbar-nav mb-2 ms-5 mt-1">
        <li class="nav-item dropdown ms-2 mt-1">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <AccountCircleIcon className='me-3' sx={{ fontSize: 30 }}/>
            Login
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">New User ? SIgnup</a></li>
            <li><hr class="dropdown-divider"/></li>
            <li><a class="dropdown-item" href="#"><AccountCircleIcon className='me-2'/>My Profile</a></li>
            <li><a class="dropdown-item" href="#"> <LocalShippingIcon className='me-2'/>Orders</a></li>
            <li><a class="dropdown-item" href="#"><FavoriteBorderIcon className='me-2'/>Wishlist</a></li>
          </ul>
        </li>
        <li class="nav-item ms-1">
          <a class="nav-link active" aria-current="page" href="#"><CartBadge/> Cart</a>
        </li>
        <li class="nav-item ms-2 mt-2">
          <a class="nav-link" aria-disabled="true"><AddBusinessIcon className='me-1 mb-1'/>Become a Seller</a>
        </li>
        <li class="nav-item ms-2 mt-2">
          <a class="nav-link" aria-disabled="true"><LocalHospitalIcon className='me-1 mb-1'/>Advisor</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
    </>
  )
}

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  }
]
