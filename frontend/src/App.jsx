import {BrowserRouter , Routes , Route} from 'react-router-dom';
import Navbar from './components/Header&Footer/Navbar';
import Footer from './components/Header&Footer/Footer';
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
function App() {

  return (
    <>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/hostLogin' element={<HostLogin/>}/>
        <Route path='/hostSignup' element={<HostSignup/>}/>
        <Route path='/purchased' element={<PurchasedProducts/>}/>
        <Route path='/show' element={<ShowPage/>}/>
        <Route path='/search' element={<SearchEngine/>}/>
        <Route path='/wishlist' element={<Wishlist/>}/>
        <Route path='/sellerDashboard' element={<HostLandingPage/>}/>
        <Route path='/addProducts' element={<AddProuducts/>}/>
      </Routes>
      <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App