import Navbar from '../Header&Footer/Navbar';
import Footer from '../Header&Footer/Footer';
import CartDashboard from './CartDashboard';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchAddress } from '../../features/dataSlice';

export default function Cart() {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(fetchAddress());
  })
  return (
    <>
    <Navbar/>
    <CartDashboard/>
    <Footer/>
    </>
  )
}
