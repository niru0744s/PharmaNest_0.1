import * as React from 'react';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    top:10,
    left:3,
    padding:"0 0.2rem",
  },
}));

export default function CartBadge() {
    return (
        <IconButton aria-label="cart" className='me-1'>
          <StyledBadge badgeContent={0} color="secondary">
            <ShoppingCartIcon/>
          </StyledBadge>
        </IconButton>
      );
}
