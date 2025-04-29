import {BrowserRouter , Routes , Route} from 'react-router-dom';
import Navbar from './components/Header&Footer/Navbar';
import Footer from './components/Header&Footer/Footer';
import LandingPage from './components/Home/LandingPage';
function App() {

  return (
    <>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<LandingPage/>} />
      </Routes>
      <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App