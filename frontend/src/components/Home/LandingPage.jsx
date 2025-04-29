import Header from "./Header";
import Hero from "./Hero";
import Products from "./Products";
import './Home.css';
import GridLayout from "./GridLayout";
import GridBottom from "./GridBottom";

export default function LandingPage() {
  return (
    <>
    <Header/>
      <Hero/>
      <Products/>
      <GridLayout/>
      <GridBottom/>
    </>
  )
}
