import Slider from 'react-slick';
import { Avatar, Box, Typography, Paper, IconButton } from '@mui/material';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';

const testimonials = [
  {
    name: 'Dinesh Kumar Rajpurohit, Kemei',
    content:
      'On PharmaNest, your listings are live in less than 2 hours and you can start selling anywhere in India. I started my business with 3 products.',
    img: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'Neha Verma, Fashionista',
    content:
      'PharmaNest helped me reach a wider audience and automate my logistics. My revenue doubled in 6 months.',
    img: 'https://i.pravatar.cc/150?img=5',
  },
  {
    name: 'Ravi Jain, TechTrade',
    content:
      'As a tech product seller, PharmaNest provided the tools I needed to scale with trust and secure payments.',
    img: 'https://i.pravatar.cc/150?img=8',
  },
];

const CustomPrev = ({ onClick }) => (
  <IconButton onClick={onClick} sx={{ position: 'absolute', left: -50, top: '50%', transform: 'translateY(-50%)' }}>
    <ArrowBackIos />
  </IconButton>
);

const CustomNext = ({ onClick }) => (
  <IconButton onClick={onClick} sx={{ position: 'absolute', right: -50, top: '50%', transform: 'translateY(-50%)' }}>
    <ArrowForwardIos />
  </IconButton>
);

const TestimonialSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomPrev />,
    nextArrow: <CustomNext />,
  };

  return (
    <Box
  sx={{
    maxWidth: '100%',           // full width usage
    width: '87vw',              // more space than default
    margin: 'auto',
    pb: 6,
    pt:2,
    px: 2,
    position: 'relative',
  }}
>
  <Slider {...settings}>
    {testimonials.map((item, index) => (
      <Paper
        key={index}
        elevation={1}
        sx={{
          borderRadius: 5,
          backgroundColor: '#f5fbff',
          display: 'flex',
          alignItems: 'center',
          p: 4,
          gap: 4,
          height: 250, // ✅ fixed consistent height
          minHeight: 250,
          width: '100%', // ensures the paper stretches fully
        }}
      >
        <Avatar
          src={item.img}
          sx={{
            width: 100,
            height: 100,
            border: '5px solid #FFD700',
          }}
        />
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {item.name}
          </Typography>
          <Typography variant="body1" mt={1}>
            {item.content}
          </Typography>
        </Box>
      </Paper>
    ))}
  </Slider>
</Box>

  );
};

export default TestimonialSlider;
