import { useState } from 'react';
import { AppBar, Button, Menu, MenuItem, Toolbar, Typography, Box } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


export default function HostNavbar() {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleHover = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const isLoggedIn = Boolean(localStorage.getItem('token'));
  return (
    <AppBar position="static" color="inherit" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Pharmanest Seller Hub
        </Typography>

        <Box display="flex" gap={2}>
          <div
            onMouseEnter={handleHover}
            onMouseLeave={handleClose}
          >
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
              {[
                'Create Account',
                'List Products',
                'Storage & Shipping',
                'Receive Payments',
                'Grow Faster',
                'Seller App',
                'Help & Support',
              ].map((item) => (
                <MenuItem key={item} onClick={handleClose}>
                  {item}
                </MenuItem>
              ))}
            </Menu>
          </div>

          <Button color="inherit">products</Button>
          <Button color="inherit">Add Products</Button>
          <Button color="inherit">Learn</Button>
          <Button color="inherit">Shopsy</Button>
          {!isLoggedIn &&  (
            <>
              <Button color="inherit">Login</Button>
          <Button variant="contained" color="warning">
            Start Selling
          </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
