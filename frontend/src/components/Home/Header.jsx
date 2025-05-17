import './Home.css'
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className=' m-2 bg-light' style={{height:"8rem" , overflow:"hidden"}}>
      <div className="row container ms-5 c-text">
        <Link className="col text-decoration-none" to={"/product/Medicine"}>
        <img src="media/headerImg/img1.png" alt="" style={{height:"5rem", width:"5rem"}} className='m-1 ms-5 product'/>
        <p className='ms-5 fw-bold'>Medicines</p>
        </Link>
        <Link className="col text-decoration-none" to={"/product/OTC_Medicine"}>
        <img src="media/headerImg/img2.png" alt="" style={{height:"5rem", width:"5rem"}} className='m-1 product'/>
        <p className='ms-0 fw-bold'>OTC Medicines</p>
        </Link>
        <Link className="col text-decoration-none" to={"/product/First_Aid"}>
        <img src="media/headerImg/img3.png" alt="" style={{height:"5rem", width:"5rem"}} className='m-1 product'/>
        <p className='ms-2 fw-bold'>First Aid</p>
        </Link>
        <Link className="col text-decoration-none" to={"/product/Hygiene"}>
        <img src="media/headerImg/img4.png" alt="" style={{height:"5rem", width:"5rem"}} className='m-1 product'/>
        <p className='ms-3 fw-bold'>Hygiene</p>
        </Link>
        <Link className="col text-decoration-none" to={"/product/Baby_product"}>
        <img src="media/headerImg/img7.png" alt="" style={{height:"5rem", width:"5rem"}} className='m-1 product'/>
        <p className='ms-0 fw-bold'>Baby Products</p>
        </Link>
        <Link className="col text-decoration-none" to={"/product/Supplements"}>
        <img src="media/headerImg/img6.png" alt="" style={{height:"5rem", width:"5rem"}} className='m-1 product'/>
        <p className='ms-0 fw-bold'>Supplements</p>
        </Link>
        <Link className="col text-decoration-none" to={"/product/Test_kits"}>
        <img src="media/headerImg/img5.png" alt="" style={{height:"5rem", width:"5rem"}} className='m-1 product'/>
        <p className='ms-2 fw-bold'>Test Kits</p>
        </Link>
      </div>
    </div>
  )
}
