import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useEffect } from "react";

const Products = ({data}) => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
  };

  return (
    <>
    <div className='bg-light m-2' style={{height:"17rem"}}>
      <h3 className="ms-2">Medicines</h3>
      <Slider {...settings}>
      {data.map((ele , idx)=>(
      <div class="ms-4" style={{width:"20rem"}} key={idx}>
        <img src={ele.imageUrl} class="product" alt="..." style={{height:"10rem" , width:"10rem"}}/>
          <div class="mb-0">
            <p class="mb-0">{ele.name}</p>
            <h5 class="mb-0">From -/{ele.price}</h5>
          </div>
      </div>
      ))}
      </Slider>
    </div>
    </>
  )
}

export default Products