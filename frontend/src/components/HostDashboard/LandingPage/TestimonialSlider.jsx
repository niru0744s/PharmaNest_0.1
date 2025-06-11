import Slider from 'react-slick';
import { Avatar, Box, Typography, Paper, IconButton, useMediaQuery, useTheme } from '@mui/material';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';

const testimonials = [
  {
    name: 'Dinesh Kumar Rajpurohit, Kemei',
    content: 'On PharmaNest, your listings are live in less than 2 hours and you can start selling anywhere in India. I started my business with 3 products.',
    img: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'Neha Verma, Fashionista',
    content: 'PharmaNest helped me reach a wider audience and automate my logistics. My revenue doubled in 6 months.',
    img: 'https://i.pravatar.cc/150?img=5',
  },
  {
    name: 'Ravi Jain, TechTrade',
    content: 'As a tech product seller, PharmaNest provided the tools I needed to scale with trust and secure payments.',
    img: 'https://i.pravatar.cc/150?img=8',
  },
];

const TestimonialSlider = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const CustomPrev = ({ onClick }) => (
    <IconButton 
      onClick={onClick} 
      sx={{ 
        position: 'absolute', 
        left: isMobile ? -30 : -50, 
        top: '50%', 
        transform: 'translateY(-50%)',
        zIndex: 1,
        backgroundColor: 'rgba(255,255,255,0.7)',
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.9)'
        }
      }}
    >
      <ArrowBackIos fontSize={isMobile ? 'small' : 'medium'} />
    </IconButton>
  );

  const CustomNext = ({ onClick }) => (
    <IconButton 
      onClick={onClick} 
      sx={{ 
        position: 'absolute', 
        right: isMobile ? -30 : -50, 
        top: '50%', 
        transform: 'translateY(-50%)',
        zIndex: 1,
        backgroundColor: 'rgba(255,255,255,0.7)',
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.9)'
        }
      }}
    >
      <ArrowForwardIos fontSize={isMobile ? 'small' : 'medium'} />
    </IconButton>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomPrev />,
    nextArrow: <CustomNext />,
    adaptiveHeight: false,
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '87vw',
        margin: 'auto',
        pb: isMobile ? 4 : 6,
        pt: isMobile ? 1 : 2,
        px: isMobile ? 1 : 2,
        position: 'relative',
      }}
    >
      <Slider {...settings}>
        {testimonials.map((item, index) => (
          <Box key={index} sx={{ px: isMobile ? 1 : 2 }}>
            <Paper
              elevation={isMobile ? 0 : 1}
              sx={{
                borderRadius: 5,
                backgroundColor: '#f5fbff',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                p: isMobile ? 3 : 4,
                gap: isMobile ? 2 : 4,
                height: isMobile ? 'auto' : 250,
                minHeight: isMobile ? 300 : 250,
                width: '100%',
              }}
            >
              <Avatar
                src={item.img}
                sx={{
                  width: isMobile ? 80 : 100,
                  height: isMobile ? 80 : 100,
                  border: '5px solid #FFD700',
                  mb: isMobile ? 2 : 0,
                }}
              />
              <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight="bold">
                  {item.name}
                </Typography>
                <Typography variant={isMobile ? 'body2' : 'body1'} mt={1}>
                  {item.content}
                </Typography>
              </Box>
            </Paper>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default TestimonialSlider;