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
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/loginSlice';
import { toast } from 'react-toastify';

export default function Navbar() {
  const dispatch = useDispatch();
  const isAuthenticated = Boolean(localStorage.getItem('user'));
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <>
   <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand px-3">
          <img src="/media/images/PHARMANEST.svg" alt="Pharmanest Logo" style={{ height: "5rem" }} />
        </Link>
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse d-none d-lg-flex">
          <form className="d-flex ms-5" role="search" style={{ width: "40%" }}>
            <SearchBox />
          </form>

          {/* Links */}
          <ul className="navbar-nav align-items-center flex-row gap-3 ms-4">
            <li className="nav-item dropdown">
              <span className="dropdown-toggle nav-link" data-bs-toggle="dropdown" role="button">
                <AccountCircleIcon className="me-1 h-icon" />
                {isAuthenticated ? user?.firstName : <Link to="/login" className='link-secondary text-decoration-none'>Login</Link>}
              </span>
              <ul className="dropdown-menu">
                {!isAuthenticated && (
                  <>
                    <li><Link className="dropdown-item" to="/signup">New User? Signup</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                  </>
                )}
                <li><Link className="dropdown-item" to="/userDashboard"><AccountCircleIcon className='me-2 h-icon'/>My Profile</Link></li>
                <li><Link className="dropdown-item" to="/orders"><LocalShippingIcon className="me-2 h-icon" />Orders</Link></li>
                <li><Link className="dropdown-item" to="/wishlist"><FavoriteBorderIcon className="me-2 h-icon" />Wishlist</Link></li>
                <li><Link className="dropdown-item" to="/" onClick={handleLogout}><LogoutIcon className="me-2 h-icon" />Logout</Link></li>
              </ul>
            </li>
            <li className="nav-item"><Link to="/cart" className="nav-link"><CartBadge className="me-1 h-icon" /> Cart</Link></li>
            <li className="nav-item"><Link to="/sellerDashboard" className="nav-link"><AddBusinessIcon className="me-1 h-icon" />Become a Seller</Link></li>
            <li className="nav-item"><Link to="/aiAdvisor" className="nav-link"><LocalHospitalIcon className="me-1 h-icon" />Advisor</Link></li>
            <li className="nav-item"><Link to="/customerCare" className="nav-link"><HeadsetMicIcon className="me-1 h-icon" />Customer Care</Link></li>
          </ul>
        </div>

        {/* Mobile View - Offcanvas */}
        <div className="offcanvas offcanvas-end d-lg-none" tabIndex="-1" id="offcanvasNavbar">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Nav Menu</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
          </div>
          <div className="offcanvas-body">
            <form className="d-flex mb-3" role="search">
              <SearchBox />
            </form>
            <ul className="navbar-nav">
              <li className="nav-item"><Link to="/cart" className="nav-link"><CartBadge /> Cart</Link></li>
              <li className="nav-item ms-2"><Link to="/sellerDashboard" className="nav-link"><AddBusinessIcon className="me-1 h-icon" />Become a Seller</Link></li>
              <li className="nav-item ms-2"><Link to="/aiAdvisor" className="nav-link"><LocalHospitalIcon className="me-1 h-icon" />Advisor</Link></li>
              <li className="nav-item ms-2"><Link to="/customerCare" className="nav-link"><HeadsetMicIcon className="me-1 h-icon" />Customer Care</Link></li>
              <li className="nav-item dropdown mt-2 ms-2">
                <span className="dropdown-toggle nav-link" data-bs-toggle="dropdown">
                  <AccountCircleIcon className="h-icon"/>
                  {isAuthenticated ? user?.firstName : <Link to="/login" className='link-secondary text-decoration-none ms-1'>Login</Link>}
                </span>
                <ul className="dropdown-menu">
                  {!isAuthenticated && (
                    <>
                      <li><Link className="dropdown-item" to="/signup">Signup</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                    </>
                  )}
                  <li><Link className="dropdown-item" to="/userDashboard">Profile</Link></li>
                  <li><Link className="dropdown-item" to="/orders">Orders</Link></li>
                  <li><Link className="dropdown-item" to="/wishlist">Wishlist</Link></li>
                  <li><Link className="dropdown-item" to="/" onClick={handleLogout}>Logout</Link></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
</>
  )
}
