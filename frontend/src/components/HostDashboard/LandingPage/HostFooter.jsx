import React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Link,
    Divider,
    IconButton
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const categories = [
    ['Sell Mobile Online', 'Sell Clothes Online', 'Sell Sarees Online', 'Sell Electronics Online', 'Sell Women Clothes Online'],
    ['Sell Shoes Online', 'Sell Jewellery Online', 'Sell Tshirts Online', 'Sell Furniture Online', 'Sell Makeup Online'],
    ['Sell Paintings Online', 'Sell Watch Online', 'Sell Books Online', 'Sell Home Products Online', 'Sell Kurtis Online'],
    ['Sell Beauty Products Online', 'Sell Toys Online', 'Sell Appliances Online', 'Sell Shirts Online', 'Sell Indian Clothes Online']
];

const HostFooter = () => {
    return (
        <Box sx={{ backgroundColor: '#2e2e2e', color: '#fff', pt: 5, mt: 10 }}>
            <Container maxWidth="lg">
                <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
                    Popular categories to sell across India
                </Typography>

                <Grid container spacing={20} justifyContent="center" sx={{ textAlign: 'left', mb: 3 }}>
                    {categories.map((group, index) => (
                        <Grid item xs={6} sm={3} key={index} sx={{ textAlign: 'left' }}>
                            {group.map((item, idx) => (
                                <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                                    <Link href="#" color="inherit" underline="hover">
                                        {item}
                                    </Link>
                                </Typography>
                            ))}
                        </Grid>
                    ))}
                </Grid>

                <Divider sx={{ bgcolor: '#fff' }} />

                <Grid container spacing={22} sx={{ mt: 3 , mb:3 , textAlign: 'left' }} justifyContent="center">
                    <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'left' }}>
                        <Typography variant="subtitle2" fontWeight="bold">Sell Online</Typography>
                        {['Create Account', 'List Products', 'Storage & Shipping', 'Fees & Commission', 'Help & Support'].map(link => (
                            <Typography key={link} variant="body2">
                                <Link href="#" color="inherit" underline="hover">{link}</Link>
                            </Typography>
                        ))}
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'left' }}>
                        <Typography variant="subtitle2" fontWeight="bold">Grow Your Business</Typography>
                        {['Insights & Tools', 'Flipkart Ads', 'Flipkart Value Services', 'Shopping Festivals'].map(link => (
                            <Typography key={link} variant="body2">
                                <Link href="#" color="inherit" underline="hover">{link}</Link>
                            </Typography>
                        ))}
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'left' }}>
                        <Typography variant="subtitle2" fontWeight="bold">Learn More</Typography>
                        {['FAQs', 'Seller Success Stories', 'Seller Blogs'].map(link => (
                            <Typography key={link} variant="body2">
                                <Link href="#" color="inherit" underline="hover">{link}</Link>
                            </Typography>
                        ))}
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'left' }}>
                        <Typography variant="subtitle2" fontWeight="bold">Download Mobile App</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
                                alt="Google Play"
                                width="120"
                            />
                            <img
                                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                                alt="App Store"
                                width="120"
                            />
                        </Box>

                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2 }}>
                            Stay Connected
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            {[FacebookIcon, InstagramIcon, LinkedInIcon, YouTubeIcon, TwitterIcon].map((Icon, i) => (
                                <IconButton key={i} color="inherit" size="small" sx={{ p: 0.5 }}>
                                    <Icon fontSize="small" />
                                </IconButton>
                            ))}
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ bgcolor: '#444', mt: 4, mb: 2 }} />

                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" sx={{ py: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} sx={{ flexGrow: 1 }}>
                        <img
                            src="media/images/PHARMANEST.png"
                            alt="Pharmanest Seller Hub"
                            style={{ height: 30 }}
                        />
                        <Typography variant="body2" color="gray">
                            © 2023 PharmaNest. All Rights Reserved
                        </Typography>
                    </Box>

                    <Box textAlign="right">
                        <Typography variant="body2" color="gray">
                            <Link href="#" color="inherit" underline="hover">Privacy Policy</Link> • <Link href="#" color="inherit" underline="hover">Terms of Use</Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default HostFooter;
