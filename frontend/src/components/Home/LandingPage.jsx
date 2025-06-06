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
import { Box } from "@mui/material";

export default function LandingPage() {
  const { categories, loading, error } = useSelector((state) => state.data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <>
    <Navbar/>
    <Header/>
      <Hero/>
      <Products data={categories[0]}/>
      <Products data={categories[1]}/>
      <Products data={categories[2]}/>
      <Box sx={{ display: "flex", flexWrap: "nowrap", gap: 2, overflowX: "auto", px: 2 }}>
      <GridLayout data={categories[3]}/>
      <GridLayout data={categories[4]}/>
      <GridLayout data={categories[5]}/>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "nowrap", gap: 2, overflowX: "auto", px: 2 }}>
      <GridLayout data={categories[6]}/>
      <GridLayout data={categories[1]}/>
      <GridLayout data={categories[2]}/>
      </Box>
    <Footer/>
    </>
  )
}
