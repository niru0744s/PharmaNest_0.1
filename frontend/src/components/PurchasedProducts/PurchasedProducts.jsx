import Navbar from '../Header&Footer/Navbar'
import Footer from '../Header&Footer/Footer'
import ShowOrder from './ShowOrder'
import { fetchPurchasedProducts } from "../../features/productActionSlice";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function PurchasedProducts() {
  const dispatch = useDispatch();
  useEffect(()=>{
    if(localStorage.getItem("token")){
   dispatch(fetchPurchasedProducts()); 
  }
  });
  return (
    <>
     <Navbar/>
     <ShowOrder/>
     <Footer/>
    </>
  )
}
