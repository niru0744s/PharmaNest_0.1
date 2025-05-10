import React from 'react'
import './Home.css'

export default function Header() {
  return (
    <div className=' m-2 bg-light' style={{height:"8rem" , overflow:"hidden"}}>
      <div className="row container ms-5 c-text">
        <div className="col">
        <img src="media/headerImg/img1.png" alt="" style={{height:"5rem", width:"5rem"}} className='m-1 ms-5 product'/>
        <p className='ms-5 fw-bold'>Medicines</p>
        </div>
        <div className="col">
        <img src="media/headerImg/img2.png" alt="" style={{height:"5rem", width:"5rem"}} className='m-1 product'/>
        <p className='ms-0 fw-bold'>OTC Medicines</p>
        </div>
        <div className="col">
        <img src="media/headerImg/img3.png" alt="" style={{height:"5rem", width:"5rem"}} className='m-1 product'/>
        <p className='ms-2 fw-bold'>First Aid</p>
        </div>
        <div className="col">
        <img src="media/headerImg/img4.png" alt="" style={{height:"5rem", width:"5rem"}} className='m-1 product'/>
        <p className='ms-3 fw-bold'>Hygiene</p>
        </div>
        <div className="col">
        <img src="media/headerImg/img7.png" alt="" style={{height:"5rem", width:"5rem"}} className='m-1 product'/>
        <p className='ms-0 fw-bold'>Baby Products</p>
        </div>
        <div className="col">
        <img src="media/headerImg/img6.png" alt="" style={{height:"5rem", width:"5rem"}} className='m-1 product'/>
        <p className='ms-0 fw-bold'>Supplements</p>
        </div>
        <div className="col">
        <img src="media/headerImg/img5.png" alt="" style={{height:"5rem", width:"5rem"}} className='m-1 product'/>
        <p className='ms-2 fw-bold'>Test Kits</p>
        </div>
      </div>
    </div>
  )
}
