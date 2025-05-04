import Header from "./Header";
import Hero from "./Hero";
import Products from "./Products";
import './Home.css';
import GridLayout from "./GridLayout";
import GridBottom from "./GridBottom";
import Navbar from "../Header&Footer/Navbar";
import Footer from "../Header&Footer/Footer";

export default function LandingPage() {
  return (
    <>
    <Navbar/>
    <Header/>
      <Hero/>
      <Products/>
      <GridLayout/>
      <GridBottom/>
    <Footer/>
    </>
  )
}
