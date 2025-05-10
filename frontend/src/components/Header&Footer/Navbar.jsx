import React from 'react'
import SearchBox from './SearchBox';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import CartBadge from './CartBadge';
import LogoutIcon from '@mui/icons-material/Logout';
import './Navbar.css'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/loginSlice';



export default function Navbar() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const user = useSelector((state) => state.login.user);

  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <Link to="/" className='nav-brand px-3'>
          <img
            style={{ height: "5rem" }}
            src="media/images/PHARMANEST.svg"
            alt="Pharmanest Logo"
          />
        </Link>
        <div class=" ms-1">
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <form class="d-flex position-relative ms-5" role="search" style={{ width: "40rem" }}>
              <SearchBox />
            </form>
            <ul class="navbar-nav mb-2 ms-2 mt-1">
              <li class="nav-item dropdown ms-2 mt-1">
                <p className='dropdown-toggle mt-2' role="button">
                  <AccountCircleIcon className='me-3 h-icon' sx={{ fontSize: 30 }} />
                  {isAuthenticated ? (<>{user?.firstName}</>) : (<Link className='link-secondary text-decoration-none' to={"/login"}>Login</Link>)}
                </p>
                <ul class="dropdown-menu">
                  <li><Link class="dropdown-item " to={"/signup"}>New User ? SIgnup</Link></li>
                  <li><hr class="dropdown-divider" /></li>
                  <li><Link class="dropdown-item" to={"/userDashboard"}><AccountCircleIcon className='me-2 h-icon' />My Profile</Link></li>
                  <li><Link class="dropdown-item" to={"/orders"}> <LocalShippingIcon className='me-2 h-icon' />Orders</Link></li>
                  <li><Link class="dropdown-item" to={"/wishlist"}><FavoriteBorderIcon className='me-2 h-icon' />Wishlist</Link></li>
                  <li><Link className='dropdown-item' to={'/'} onClick={handleLogout}><LogoutIcon className='h-icon' />Logout</Link></li>
                </ul>
              </li>
              <li class="nav-item ms-1">
                <Link to="/cart" class="nav-link active"><CartBadge />  Cart</Link>
              </li>
              <li class="nav-item ms-2 mt-2">
                <Link to="/sellerDashboard" class="nav-link" aria-disabled="true"><AddBusinessIcon className=' mb-1 h-icon' />Become a Seller</Link>
              </li>
              <li class="nav-item ms-2 mt-2">
                <Link to="/aiAdvisor" class="nav-link" aria-disabled="true"><LocalHospitalIcon className=' mb-1 h-icon' />Advisor</Link>
              </li>
              <li class="nav-item mt-2">
                <Link to="/customerCare" class="nav-link" aria-disabled="true"><HeadsetMicIcon className=' mb-1 h-icon' /></Link>
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
