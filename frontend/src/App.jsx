import {BrowserRouter , Routes , Route} from 'react-router-dom';
import LandingPage from './components/Home/LandingPage';
import Login from './components/UserAuth/Login';
import Cart from './components/Cart/Cart';
import PurchasedProducts from './components/PurchasedProducts/PurchasedProducts';
import ShowPage from './components/ShowProducts/ShowPage';
import SearchEngine from './components/SearchedProducts/SearchEngine';
import Wishlist from './components/Wishlist/Wishlist';
import HostLandingPage from './components/HostDashboard/LandingPage/HostLandingPage';
import AddProuducts from './components/HostDashboard/AddProducts/AddProuducts';
import HostSignup from './components/HostDashboard/HostAuth/HostSignup';
import HostLogin from './components/HostDashboard/HostAuth/HostLogin';
import Signup from './components/UserAuth/Signup';
import AccountCenter from './components/User/AccountCenter';
import AiAdvisor from './components/Advisor/AiAdvisor';
import SellerProducts from './components/HostDashboard/ShowProducts/SellerProducts';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EditProductForm from './components/HostDashboard/EditProducts/EditProductForm';
import ShowAllProducts from './components/ShowAllProducts/ShowAllProducts';


import { fetchProductsByCategory , fetchAddress } from './features/dataSlice';
import { fetchWishlist } from './features/productActionSlice';
import { fetchPurchasedProducts } from './features/productActionSlice';
import { fetchCartProducts } from './features/productActionSlice';
import { useEffect } from 'react';
import { useDispatch , useSelector } from 'react-redux';
import { logout } from './features/loginSlice';
import { toast } from 'react-toastify';
import { isTokenValid } from './utils/checkToken';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state)=> state.login.user);
    useEffect(()=>{
      dispatch(fetchProductsByCategory());
      if (!isTokenValid()) {
      dispatch(logout());
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.warning("Session expired ! You have to login again");
      }
      if(localStorage.getItem("user")){
        dispatch(fetchWishlist());
        dispatch(fetchCartProducts());
        dispatch(fetchPurchasedProducts());
      }
    },[user]);
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/hostLogin' element={<HostLogin/>}/>
        <Route path='/hostSignup' element={<HostSignup/>}/>
        <Route path='/aiAdvisor' element={<AiAdvisor/>}/>
        <Route path='/show/:id' element={<ShowPage/>}/>
        <Route path='/search/:categoryName' element={<SearchEngine/>}/>
        <Route path='/sellerDashboard' element={<HostLandingPage/>}/>
        <Route path='/userDashboard' element={<AccountCenter/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/orders' element={<PurchasedProducts/>}/>
        <Route path='/wishlist' element={<Wishlist/>}/>
        <Route path='/addProducts' element={<AddProuducts/>}/>
        <Route path='/sellerProduct' element={<SellerProducts/>}/>
        <Route path="/editProduct/:id" element={<EditProductForm/>}/>
        <Route path="/product/:categoryName" element={<ShowAllProducts/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App