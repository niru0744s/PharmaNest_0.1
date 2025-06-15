import Header from "./Header";
import Hero from "./Hero";
import Products from "./Products";
import './Home.css';
import GridLayout from "./GridLayout";
import GridBottom from "./GridBottom";
import Navbar from "../Header&Footer/Navbar";
import Footer from "../Header&Footer/Footer";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box,  } from "@mui/material";
import { Skeleton } from '@mui/material';
export default function LandingPage() {
    const { categories, loading, error } = useSelector((state) => state.data);
  
if (loading) return (
  <>
    <Navbar />
    <Box sx={{ p: 3 }}>
      {/* Hero Skeleton */}
      <Skeleton variant="rectangular" width="100%" height={400} sx={{ mb: 4 }} />
      
      {/* Product Section Skeletons */}
      {[1, 2, 3].map((item) => (
        <Box key={item} sx={{ mb: 4 }}>
          <Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            {[1, 2, 3, 4].map((product) => (
              <Skeleton key={product} variant="rectangular" width={250} height={300} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
    <Footer />
  </>
);
  
  if (error) return (
    <>
      <Navbar />
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: 'error.main'
      }}>
        <Typography variant="h6">Error: {error}</Typography>
      </Box>
      <Footer />
    </>
  );
  return (
    <>
    <Navbar/>
    <Header/>
      <Hero/>
      <Products data={categories[0]}/>
      <Products data={categories[1]}/>
      <Products data={categories[2]}/>
      <Box sx={{ display: "flex",flexWrap:"wrap", overflowX: "auto", px: 2 }}>
      <GridLayout data={categories[3]}/>
      <GridLayout data={categories[4]}/>
      <GridLayout data={categories[5]}/>
      </Box>
      <Box sx={{ display: "flex",flexWrap:"wrap" , overflowX: "auto", px: 2 }}>
      <GridLayout data={categories[6]}/>
      <GridLayout data={categories[1]}/>
      <GridLayout data={categories[2]}/>
      </Box>
    <Footer/>
    </>
  )
}
