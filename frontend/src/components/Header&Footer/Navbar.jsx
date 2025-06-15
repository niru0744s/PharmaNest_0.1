import { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { AppBar, Toolbar, Box, IconButton, Menu, MenuItem, Badge, Tooltip } from '@mui/material';
import { 
  AccountCircle as AccountCircleIcon,
  LocalShipping as LocalShippingIcon,
  FavoriteBorder as FavoriteBorderIcon,
  AddBusiness as AddBusinessIcon,
  LocalHospital as LocalHospitalIcon,
  HeadsetMic as HeadsetMicIcon,
  Logout as LogoutIcon,
  ShoppingCart as ShoppingCartIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/loginSlice';
import { toast } from 'react-toastify';
import SearchBox from './SearchBox';
import CartBadge from './CartBadge';
import './Navbar.css';

// Styled components with error boundaries
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0.5rem 1rem',
  [theme.breakpoints.up('md')]: {
    padding: '0.5rem 2rem',
  },
}));

const NavLinks = styled(Box)(({ theme }) => ({
  display: 'none',
  alignItems: 'center',
  gap: '1.5rem',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const NavLink = styled(Link)(({ theme }) => ({
  color: 'white',
  textDecoration: 'none',
  position: 'relative',
  padding: '0.5rem 0',
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem',
  fontSize: '0.9rem',
  fontWeight: '500',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: alpha(theme.palette.common.white, 0.8),
    '&::after': {
      width: '100%',
      backgroundColor: '#4ecdc4',
    },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '0',
    height: '2px',
    backgroundColor: 'transparent',
    transition: 'all 0.3s ease',
  },
  '&.active': {
    '&::after': {
      width: '100%',
      backgroundColor: '#4ecdc4',
    },
  },
}));

const UserMenuButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem',
  cursor: 'pointer',
  color: 'white',
  padding: '0.5rem 0.8rem',
  borderRadius: '4px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
  },
}));

const MobileMenu = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  right: 0,
  width: '280px',
  height: '100vh',
  backgroundColor: '#2c3e50',
  zIndex: 1200,
  padding: '1.5rem',
  transform: 'translateX(100%)',
  transition: 'transform 0.3s ease-in-out',
  '&.open': {
    transform: 'translateX(0)',
  },
}));

const MobileNavLink = styled(Link)(({ theme }) => ({
  color: 'white',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  padding: '0.8rem 0',
  borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  fontSize: '1rem',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    paddingLeft: '0.5rem',
  },
}));

const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '4px',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
    boxShadow: '0 0 0 2px rgba(78, 205, 196, 0.2)',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

export default function Navbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Error handling for user data
  let isAuthenticated = false;
  let user = null;
  let cartItems = 0;

  try {
    isAuthenticated = Boolean(localStorage.getItem('user'));
    user = JSON.parse(localStorage.getItem('user') || 'null');
    cartItems = useSelector(state => state.cart?.items?.length) || 0;
  } catch (error) {
    console.error("Error reading user data:", error);
    // Clear invalid user data
    localStorage.removeItem('user');
  }

  const handleLogout = () => {
    try {
      dispatch(logout());
      toast.success("You are logged out!");
      navigate('/');
      handleMenuClose();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#2c3e50', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <StyledToolbar>
        {/* Logo with error boundary */}
        <Link to="/">
          <img 
            src="/media/images/newLogo.png" 
            alt="Pharmanest Logo" 
            style={{ height: "3.5rem", marginRight: '1rem' }} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/media/images/placeholder-logo.svg';
            }}
          />
        </Link>

        {/* Search Box - Hidden on mobile */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, flex: 1, maxWidth: '600px', mx: 2 }}>
          
            <SearchBox />
          
        </Box>

        {/* Desktop Navigation */}
        <NavLinks>
            <NavLink 
              to="/cart" 
              className={location.pathname === '/cart' ? 'active' : ''}
              title='cart'
            >
              <CartBadge/>
              Cart
            </NavLink>

          <NavLink 
            to="/sellerDashboard" 
            className={location.pathname === '/sellerDashboard' ? 'active' : ''}
            title='Seller'
          >
            <AddBusinessIcon fontSize="small" />
            Sell
          </NavLink>

          <NavLink 
            to="/aiAdvisor" 
            className={location.pathname === '/aiAdvisor' ? 'active' : ''}
            title='AI Advisor'
          >
            <LocalHospitalIcon fontSize="small" />
            Advisor
          </NavLink>

          <NavLink 
            to="/customerCare" 
            className={location.pathname === '/customerCare' ? 'active' : ''}
            title='Help center'
          >
            <HeadsetMicIcon fontSize="small" />
            Help
          </NavLink>

          {/* User Dropdown with error handling */}
          <UserMenuButton onClick={handleMenuOpen}>
            <AccountCircleIcon fontSize="small" />
            {isAuthenticated && user?.firstName ? user.firstName : 'Account'}
          </UserMenuButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                backgroundColor: '#34495e',
                color: 'white',
                margin: "0",
                padding: "0",
                minWidth: '150px',
              },
            }}
          >
            {!isAuthenticated && (
              <>
                <MenuItem 
                  onClick={handleMenuClose} 
                  component={Link} 
                  to="/login"
                  sx={{ '&:hover': { backgroundColor: alpha('#ffffff', 0.1) } }}
                >
                  Login
                </MenuItem>
                <MenuItem divider sx={{ '&.MuiDivider-root': { backgroundColor: alpha('#ffffff', 0.1) } }} />
              </>
            )}
            {isAuthenticated && (
            <>
            <MenuItem 
              onClick={handleMenuClose} 
              component={Link} 
              to="/userDashboard"
              sx={{ '&:hover': { backgroundColor: alpha('#ffffff', 0.1) } }}
            >
              <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
              My Profile
            </MenuItem>
            <MenuItem 
              onClick={handleMenuClose} 
              component={Link} 
              to="/orders"
              sx={{ '&:hover': { backgroundColor: alpha('#ffffff', 0.1) } }}
            >
              <LocalShippingIcon fontSize="small" sx={{ mr: 1 }} />
              Orders
            </MenuItem>
            <MenuItem 
              onClick={handleMenuClose} 
              component={Link} 
              to="/wishlist"
              sx={{ '&:hover': { backgroundColor: alpha('#ffffff', 0.1) } }}
            >
              <FavoriteBorderIcon fontSize="small" sx={{ mr: 1 }} />
              Wishlist
            </MenuItem>
            
              <MenuItem 
                onClick={handleLogout}
                sx={{ '&:hover': { backgroundColor: alpha('#ffffff', 0.1) } }}
              >
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
              </>
            )}
          </Menu>
        </NavLinks>

        {/* Mobile Menu Button */}
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileMenu}
          sx={{ 
            display: { md: 'none' },
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
              backgroundColor: alpha('#ffffff', 0.1),
            }
          }}
        >
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </StyledToolbar>

      {/* Mobile Search - Only visible on mobile */}
      <Box sx={{ 
        display: { xs: 'block', md: 'none' }, 
        p: 2, 
        backgroundColor: '#34495e',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: alpha('#34495e', 0.9),
        }
      }}>
        <SearchContainer>
          <SearchBox />
        </SearchContainer>
      </Box>

      {/* Mobile Menu */}
      <MobileMenu className={mobileMenuOpen ? 'open' : ''}>
        <Box display="flex" justifyContent="flex-end" mb={3}>
          <IconButton 
            onClick={toggleMobileMenu} 
            sx={{ 
              color: 'white',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'rotate(90deg)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box display="flex" flexDirection="column">
          <MobileNavLink to="/cart">
            {cartItems > 0 ? (
              <Badge badgeContent={cartItems} color="error">
                <ShoppingCartIcon />
              </Badge>
            ) : (
              <ShoppingCartIcon className="empty-cart-icon" />
            )}
            Cart
          </MobileNavLink>

          <MobileNavLink to="/sellerDashboard">
            <AddBusinessIcon />
            Become a Seller
          </MobileNavLink>

          <MobileNavLink to="/aiAdvisor">
            <LocalHospitalIcon />
            Advisor
          </MobileNavLink>

          <MobileNavLink to="/customerCare">
            <HeadsetMicIcon />
            Customer Care
          </MobileNavLink>

          <Box mt={2}>
            <MobileNavLink to={isAuthenticated ? "/userDashboard" : "/login"}>
              <AccountCircleIcon />
              {isAuthenticated && user?.firstName ? user.firstName : 'Login'}
            </MobileNavLink>

            {isAuthenticated && (
              <>
                <MobileNavLink to="/orders">
                  <LocalShippingIcon />
                  Orders
                </MobileNavLink>
                <MobileNavLink to="/wishlist">
                  <FavoriteBorderIcon />
                  Wishlist
                </MobileNavLink>
                <MobileNavLink to="/" onClick={handleLogout}>
                  <LogoutIcon />
                  Logout
                </MobileNavLink>
              </>
            )}

            {!isAuthenticated && (
              <MobileNavLink to="/signup">
                <AccountCircleIcon />
                Sign Up
              </MobileNavLink>
            )}
          </Box>
        </Box>
      </MobileMenu>
    </AppBar>
  );
}