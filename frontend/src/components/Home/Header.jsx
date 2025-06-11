import './Home.css'
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className='m-2 bg-light' style={{overflow:"hidden"}}>
      <div className="row container ms-lg-5 c-text">
        <Link className="col text-decoration-none" to={"/product/Medicine"}>
        <img src="/media/headerImg/img1.png" alt="" className='product'/>
        <p className='fw-bold p-text'>Medicines</p>
        </Link>
        <Link className="col text-decoration-none" to={"/product/OTC_Medicine"}>
        <img src="/media/headerImg/img2.png" alt="" className='product'/>
        <p className='fw-bold p-text'>OTC Medicines</p>
        </Link>
        <Link className="col text-decoration-none" to={"/product/First_Aid"}>
        <img src="/media/headerImg/img3.png" alt="" className='product'/>
        <p className='fw-bold p-text'>First Aid</p>
        </Link>
        <Link className="col text-decoration-none" to={"/product/Hygiene"}>
        <img src="/media/headerImg/img4.png" alt="" className='product'/>
        <p className='fw-bold p-text'>Hygiene</p>
        </Link>
        <Link className="col text-decoration-none" to={"/product/Baby_product"}>
        <img src="/media/headerImg/img7.png" alt="" className='product'/>
        <p className='fw-bold p-text'>Baby Products</p>
        </Link>
        <Link className="col text-decoration-none" to={"/product/Supplements"}>
        <img src="/media/headerImg/img6.png" alt="" className='product'/>
        <p className='fw-bold p-text'>Supplements</p>
        </Link>
        <Link className="col text-decoration-none" to={"/product/Test_kits"}>
        <img src="/media/headerImg/img5.png" alt="" style={{height:"47%", width:"47%"}} className='product'/>
        <p className='fw-bold p-text'>Test Kits</p>
        </Link>
      </div>
    </div>
  )
}
