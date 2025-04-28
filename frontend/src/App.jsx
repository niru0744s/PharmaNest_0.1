import {BrowserRouter , Routes , Route} from 'react-router-dom';
import Hero from './components/Home/Hero';
import Navbar from './Navbar';
import Footer from './Footer';
function App() {

  return (
    <>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Hero/>} />
      </Routes>
      <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App