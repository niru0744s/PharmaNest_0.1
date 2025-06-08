import * as React from 'react';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSelector } from 'react-redux';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    top:10,
    left:3,
    padding:"0 0.2rem",
  },
}));

export default function CartBadge() {
  const cartItems = useSelector((state) => state.productActions.cart);
    return (
        <IconButton aria-label="cart" className='me-1'>
          <StyledBadge badgeContent={cartItems.length} color="secondary">
            <ShoppingCartIcon className='h-icon'/>
          </StyledBadge>
        </IconButton>
      );
}
