import { Container, Typography, Grid, Box } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PercentIcon from '@mui/icons-material/Percent';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LocalMallIcon from '@mui/icons-material/LocalMall';

const features = [
  {
    icon: <PeopleAltIcon color="primary" fontSize="large" />,
    text: '45 crore+ PharmaNest customers',
  },
  {
    icon: <AccountBalanceWalletIcon color="primary" fontSize="large" />,
    text: '7* days secure & regular payments',
  },
  {
    icon: <PercentIcon color="primary" fontSize="large" />,
    text: 'Low cost of doing business',
  },
  {
    icon: <SupportAgentIcon color="primary" fontSize="large" />,
    text: 'One click Seller Support',
  },
  {
    icon: <LocalMallIcon color="primary" fontSize="large" />,
    text: 'Access to The Big Billion Days & more',
  },
];

export default function HeroSection() {
  return (
    <div className="pt-5 container" >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Sell Online with PharmaNest
      </Typography>

      <Box
        className="p-3"
        sx={{
          borderRadius: 3,
          backgroundColor: '#fff',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {features.map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={2.4}
              gap={2}
              key={index}
              sx={{
                display: 'flex',
                mx:3,
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRight: index < features.length - 1 ? '1px solid #e0e0e0' : 'none',
              }}
            >
              {item.icon}
              <Typography variant="body1" sx={{ mt: 1 }}>
                {item.text}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Typography
        variant="h5"
        fontWeight="bold"
        color="primary"
        sx={{ mt: 4 }}
      >
        Seller Success <span style={{ color: '#000' }}>Stories</span>
      </Typography>
    </div>
  )
}
