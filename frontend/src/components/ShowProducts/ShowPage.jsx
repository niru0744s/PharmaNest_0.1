import ProductDetails from "./ProductDetails";
import Navbar from "../Header&Footer/Navbar";
import MegaMenu from "../Header&Footer/MegaMenu"; 
import Footer from "../Header&Footer/Footer";

export default function ShowPage() {
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  return (
    <>
    <Navbar/>
    <ProductDetails/>
    <Footer/>
    </>
  )
}
