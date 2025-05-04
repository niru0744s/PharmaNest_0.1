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
import UserPf from './components/User/UserPf';
import UserDashboard from './components/User/UserDashboard';
function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/userDashboard' element={<UserDashboard/>}/>
        <Route path="profile" element={<UserPf />} />
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/hostLogin' element={<HostLogin/>}/>
        <Route path='/hostSignup' element={<HostSignup/>}/>
        <Route path='/orders' element={<PurchasedProducts/>}/>
        <Route path='/show' element={<ShowPage/>}/>
        <Route path='/search' element={<SearchEngine/>}/>
        <Route path='/wishlist' element={<Wishlist/>}/>
        <Route path='/sellerDashboard' element={<HostLandingPage/>}/>
        <Route path='/addProducts' element={<AddProuducts/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App