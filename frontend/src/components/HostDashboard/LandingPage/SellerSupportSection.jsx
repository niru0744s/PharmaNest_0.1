import React from 'react';
import { Container, Grid, Box, Typography, List, ListItem, ListItemIcon, ListItemText, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const featureList1 = [
  'Price Recommendation Tool: Helps you determine optimal pricing for your products.',
  'Product Recommendation Tool: Suggests popular and trending products to expand your product selection.',
  'Flipkart Ads: Enables you to advertise your products and reach a larger customer base.',
  'Paid Account Management: Offers dedicated account management support for personalized guidance.',
  'Catalog & Photoshoot: Access to high-quality product catalogs and images.',
  'Shopping Festivals: Participate in sales events and promotions.',
];

const featureList2 = [
  'Create and manage listing',
  'Manage orders and fulfillment',
  'Track inventory',
  'Payments',
  'Advertising',
  'Business insights',
  'Seller Support and more',
];

const SellerSupportSection = () => {
  return (
    <Container sx={{ py: 5 }}>
      {/* Grow Faster Section */}
      <Grid container spacing={4} alignItems="center">
  {/* LEFT: TEXT (7 columns on md+, full on xs) */}
  <Grid item xs={12} md={7}>
    <Typography variant="h6" color="primary" gutterBottom>
      Grow Faster
    </Typography>
    <Typography variant="body2" color="textSecondary" gutterBottom>
      At Flipkart, we recognize that there may be times when you require additional assistance for your online business...
    </Typography>
    <List>
      {featureList1.map((item, i) => (
        <ListItem key={i} disableGutters>
          <ListItemIcon><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
          <ListItemText primary={<Typography variant="body2">{item}</Typography>} />
        </ListItem>
      ))}
    </List>
    <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
      Know more on how to grow your business
    </Typography>
  </Grid>

  {/* RIGHT: IMAGE (5 columns on md+, full on xs) */}
  <Grid item xs={12} md={5}>
    <Box sx={{ textAlign: 'center' }}>
      <img
        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        alt="Grow"
        style={{
          width: '90%',
          maxWidth: '350px',
          margin: 'auto',
        }}
      />
    </Box>
  </Grid>
</Grid>


      {/* Seller App Section */}
      <Paper sx={{ my: 5, p: 4, backgroundColor: '#f0f8ff' }}>
        <Grid container spacing={20} alignItems="center">
          <Grid item md={5} xs={12}>
            <img src="/media/images/sellerApp.webp" alt="App" width="100%" />
          </Grid>
          <Grid item md={7} xs={12}>
            <Typography variant="h6" color="primary" gutterBottom>Seller App</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              The Seller Hub App enables you to conveniently handle:
            </Typography>
            <List>
              {featureList2.map((item, i) => (
                <ListItem key={i} disableGutters>
                  <ListItemIcon><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                  <ListItemText primary={<Typography variant="body2">{item}</Typography>} />
                </ListItem>
              ))}
            </List>
            <Typography variant="body2" sx={{ mt: 2 }}>
              <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">Google Play</a> | <a href="https://apple.com" target="_blank" rel="noopener noreferrer">App Store</a>
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Help & Support Section */}
      <Grid container spacing={4} alignItems="center">
        <Grid item md={7} xs={12}>
          <Typography variant="h6" color="primary" gutterBottom>Help & Support</Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            What sets us apart is our exceptional Flipkart seller support services...
          </Typography>
          <Typography variant="body2" color="primary">
            Know more about the services
          </Typography>
          <Typography variant="body2" color="textSecondary">
            A step-by-step guide to help with your Flipkart account creation can be downloaded from here.
          </Typography>
        </Grid>
        <Grid item md={5} xs={12}>
          <img src="https://cdn-icons-png.flaticon.com/512/5231/5231019.png" alt="Support" width="100%" />
        </Grid>
      </Grid>
    </Container>
  );
};

export default SellerSupportSection;
