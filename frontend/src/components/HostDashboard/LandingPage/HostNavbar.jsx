import { useState } from 'react';
import { 
  AppBar, 
  Button, 
  Menu, 
  MenuItem, 
  Toolbar, 
  Typography, 
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Collapse
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close'; // Added close icon
import { Link, useNavigate } from 'react-router-dom';
import { hostLogout } from '../../../features/hostLoginSlices';
import { useDispatch } from 'react-redux';

export default function HostNavbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSellOnline, setOpenSellOnline] = useState(false); // State for mobile dropdown
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleHover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(hostLogout());
    navigate("/sellerDashboard");
    setMobileOpen(false);
  };

  const isLoggedIn = Boolean(localStorage.getItem('host'));

  const navItems = [
    { 
      text: 'Sell Online', 
      subItems: [
        'Create Account',
        'List Products',
        'Storage & Shipping',
        'Receive Payments',
        'Grow Faster',
        'Seller App',
        'Help & Support',
      ]
    },
    { text: 'Products', link: '/sellerProduct' },
    { text: 'Add Products', link: '/addProducts' },
    { text: 'Learn', link: '#' },
    { text: 'Shopsy', link: '#' },
  ];

  const drawer = (
    <Box sx={{ width: 250, padding: 2 }}>
      {/* Close button at top right */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List>
        {navItems.map((item) => (
          <div key={item.text}>
            {item.subItems ? (
              <>
                <ListItem 
                  button 
                  onClick={() => setOpenSellOnline(!openSellOnline)}
                >
                  <ListItemText primary={item.text} />
                  <KeyboardArrowDownIcon 
                    sx={{ 
                      transform: openSellOnline ? 'rotate(180deg)' : 'rotate(0deg)', 
                      transition: '0.3s' 
                    }}
                  />
                </ListItem>
                <Collapse in={openSellOnline} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItem 
                        button 
                        key={subItem}
                        sx={{ pl: 4 }}
                        onClick={() => setMobileOpen(false)}
                      >
                        <ListItemText primary={subItem} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem 
                button 
                component={Link} 
                to={item.link}
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            )}
          </div>
        ))}
        <Divider sx={{ my: 2 }} />
        {!isLoggedIn ? (
          <>
            <ListItem 
              button 
              component={Link} 
              to="/hostLogin"
              onClick={() => setMobileOpen(false)}
            >
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem>
              <Button 
                variant="contained" 
                color="warning" 
                fullWidth
                onClick={() => setMobileOpen(false)}
              >
                Start Selling
              </Button>
            </ListItem>
          </>
        ) : (
          <ListItem>
            <Button 
              variant="contained" 
              color="warning" 
              fullWidth
              onClick={handleLogout}
            >
              Logout
            </Button>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" color="inherit" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: "none", color: "orange" }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Pharmanest Seller Hub
            </Typography>
          </Link>
          
          {isMobile ? (
            <IconButton
              color="inherit"
              edge="end"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box display="flex" gap={2}>
              <div onMouseEnter={handleHover} onMouseLeave={handleClose}>
                <Button
                  variant="text"
                  color="inherit"
                  endIcon={
                    <KeyboardArrowDownIcon
                      sx={{ transform: Boolean(anchorEl) ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}
                    />
                  }
                >
                  Sell Online
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  MenuListProps={{ onMouseLeave: handleClose }}
                  PaperProps={{
                    elevation: 3,
                    sx: { mt: 1 },
                  }}
                >
                  {navItems[0].subItems.map((item) => (
                    <MenuItem key={item} onClick={handleClose}>
                      {item}
                    </MenuItem>
                  ))}
                </Menu>
              </div>

              <Button color="inherit" component={Link} to="/sellerProduct">Products</Button>
              <Button color="inherit" component={Link} to="/addProducts">Add Products</Button>
              <Button color="inherit">Learn</Button>
              <Button color="inherit">Shopsy</Button>
              
              {!isLoggedIn ? (
                <>
                  <Button component={Link} to="/hostLogin">Login</Button>
                  <Button variant="contained" color="warning">
                    Start Selling
                  </Button>
                </>
              ) : (
                <Button variant="contained" color="warning" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
    </>
  );
}