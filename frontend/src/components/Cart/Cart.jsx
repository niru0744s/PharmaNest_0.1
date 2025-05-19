import Navbar from '../Header&Footer/Navbar';
import Footer from '../Header&Footer/Footer';
import CartDashboard from './CartDashboard';
import { toast } from 'react-toastify';

export default function Cart() {
  return (
    <>
    <Navbar/>
    <CartDashboard/>
    <Footer/>
    </>
  )
}
