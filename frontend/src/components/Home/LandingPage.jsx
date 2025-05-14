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
import { fetchProductsByCategory } from '../../features/dataSlice';

export default function LandingPage() {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.data);
  useEffect(() => {
    dispatch(fetchProductsByCategory());
  }, [dispatch]);

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
      <GridLayout data={categories[3]}/>
      <GridBottom/>
    <Footer/>
    </>
  )
}
