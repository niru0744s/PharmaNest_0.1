import React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Link,
    Divider,
    IconButton,
    useTheme,
    useMediaQuery
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{ 
            backgroundColor: '#2e2e2e', 
            color: '#fff', 
            pt: isMobile ? 3 : 5,
            mt: isMobile ? 5 : 10 
        }}>
            <Container maxWidth="lg">
                <Typography 
                    variant={isMobile ? "h6" : "h4"} 
                    align="center" 
                    fontWeight="bold" 
                    gutterBottom
                    sx={{ mb: isMobile ? 2 : 3 }}
                >
                    Popular categories to sell across India
                </Typography>

                <Grid 
                    container 
                    spacing={isMobile ? 2 : 4} 
                    justifyContent="center" 
                    sx={{ 
                        mb: isMobile ? 2 : 3,
                        textAlign: isMobile ? 'center' : 'left'
                    }}
                >
                    {categories.map((group, index) => (
                        <Grid 
                            item 
                            xs={6} 
                            sm={3} 
                            key={index} 
                            sx={{ 
                                textAlign: isMobile ? 'center' : 'left',
                                mb: isMobile ? 2 : 0
                            }}
                        >
                            {group.map((item, idx) => (
                                <Typography 
                                    key={idx} 
                                    variant="body2" 
                                    sx={{ 
                                        mb: 1,
                                        fontSize: isMobile ? '0.8rem' : '0.875rem'
                                    }}
                                >
                                    <Link href="#" color="inherit" underline="hover">
                                        {item}
                                    </Link>
                                </Typography>
                            ))}
                        </Grid>
                    ))}
                </Grid>

                <Divider sx={{ bgcolor: '#fff', my: isMobile ? 2 : 3 }} />

                <Grid 
                    container 
                    spacing={isMobile ? 2 : 4} 
                    sx={{ 
                        mt: isMobile ? 1 : 3,
                        mb: isMobile ? 2 : 3,
                        textAlign: isMobile ? 'center' : 'left' 
                    }} 
                    justifyContent="center"
                >
                    <Grid item xs={6} sm={6} md={3}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                            Sell Online
                        </Typography>
                        {['Create Account', 'List Products', 'Storage & Shipping', 'Fees & Commission', 'Help & Support'].map(link => (
                            <Typography 
                                key={link} 
                                variant="body2" 
                                sx={{ 
                                    mb: 1,
                                    fontSize: isMobile ? '0.8rem' : '0.875rem'
                                }}
                            >
                                <Link href="#" color="inherit" underline="hover">{link}</Link>
                            </Typography>
                        ))}
                    </Grid>

                    <Grid item xs={6} sm={6} md={3}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                            Grow Your Business
                        </Typography>
                        {['Insights & Tools', 'Flipkart Ads', 'Flipkart Value Services', 'Shopping Festivals'].map(link => (
                            <Typography 
                                key={link} 
                                variant="body2" 
                                sx={{ 
                                    mb: 1,
                                    fontSize: isMobile ? '0.8rem' : '0.875rem'
                                }}
                            >
                                <Link href="#" color="inherit" underline="hover">{link}</Link>
                            </Typography>
                        ))}
                    </Grid>

                    <Grid item xs={6} sm={6} md={3} sx={{ mt: isMobile ? 2 : 0 }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                            Learn More
                        </Typography>
                        {['FAQs', 'Seller Success Stories', 'Seller Blogs'].map(link => (
                            <Typography 
                                key={link} 
                                variant="body2" 
                                sx={{ 
                                    mb: 1,
                                    fontSize: isMobile ? '0.8rem' : '0.875rem'
                                }}
                            >
                                <Link href="#" color="inherit" underline="hover">{link}</Link>
                            </Typography>
                        ))}
                    </Grid>

                    <Grid 
                        item 
                        xs={6} 
                        sm={6} 
                        md={3} 
                        sx={{ 
                            mt: isMobile ? 2 : 0,
                            textAlign: isMobile ? 'center' : 'left'
                        }}
                    >
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                            Download Mobile App
                        </Typography>
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: 1, 
                            mt: 1,
                            alignItems: isMobile ? 'center' : 'flex-start'
                        }}>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
                                alt="Google Play"
                                width={isMobile ? "100" : "120"}
                            />
                            <img
                                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                                alt="App Store"
                                width={isMobile ? "100" : "120"}
                            />
                        </Box>

                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                            Stay Connected
                        </Typography>
                        <Box sx={{ 
                            display: 'flex', 
                            gap: 1, 
                            mt: 1,
                            justifyContent: isMobile ? 'center' : 'flex-start'
                        }}>
                            {[FacebookIcon, InstagramIcon, LinkedInIcon, YouTubeIcon, TwitterIcon].map((Icon, i) => (
                                <IconButton 
                                    key={i} 
                                    color="inherit" 
                                    size="small" 
                                    sx={{ p: 0.5 }}
                                >
                                    <Icon fontSize={isMobile ? "small" : "medium"} />
                                </IconButton>
                            ))}
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ bgcolor: '#444', mt: isMobile ? 2 : 4, mb: isMobile ? 1 : 2 }} />

                <Box 
                    display="flex" 
                    flexDirection={isMobile ? 'column' : 'row'} 
                    justifyContent="space-between" 
                    alignItems="center" 
                    sx={{ 
                        py: isMobile ? 1 : 2,
                        textAlign: isMobile ? 'center' : 'left'
                    }}
                >
                    <Box 
                        display="flex" 
                        alignItems="center" 
                        gap={1} 
                        sx={{ 
                            flexGrow: 1,
                            mb: isMobile ? 1 : 0,
                            justifyContent: isMobile ? 'center' : 'flex-start'
                        }}
                    >
                        <img
                            src="/media/images/PHARMANEST.png"
                            alt="Pharmanest Seller Hub"
                            style={{ height: isMobile ? 24 : 30 }}
                        />
                        <Typography 
                            variant="body2" 
                            color="gray"
                            sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}
                        >
                            © 2023 PharmaNest. All Rights Reserved
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: isMobile ? 'center' : 'right' }}>
                        <Typography 
                            variant="body2" 
                            color="gray"
                            sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}
                        >
                            <Link href="#" color="inherit" underline="hover">Privacy Policy</Link> • <Link href="#" color="inherit" underline="hover">Terms of Use</Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default HostFooter;