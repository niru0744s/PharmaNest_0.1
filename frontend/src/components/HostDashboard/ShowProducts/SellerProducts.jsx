import React, { useEffect } from 'react'
import HostNavbar from '../LandingPage/HostNavbar';
import HostFooter from '../LandingPage/HostFooter';
import { showProduct } from '../../../features/ProductSlice';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from './ProductCard';

export default function SellerProducts() {
  const dispatch = useDispatch();
  const {products , loading , error} = useSelector((state)=> state.product);
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
  };
  useEffect(()=>{
    dispatch(showProduct());
  },[dispatch]);
  return (
    <>
    <HostNavbar/>
      <div className='container my-5'>
        {products.map((ele,idx)=>(
          <div className="row bg-light" key={idx}>
            <p className='text-center fw-bold fs-2'>{ele.category}</p>
            {ele.products.map((e,i)=>(
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" key={e._id}>
                <ProductCard product={e}/>
              </div>
            ))}
          </div>
        ))}
      </div>
    <HostFooter/>
    </>
  )
}
