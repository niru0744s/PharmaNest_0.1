import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Products = () => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
  };
  return (
    <>

    <div className='bg-light m-2' style={{height:"20rem"}}>
      <h3 className='ms-4 mt-3'>Baby Products & More </h3>
      <Slider {...settings}>
      {data.map((ele)=>(
      <div class="ms-4" style={{width:"20rem"}}>
        <img src={ele.image} class="" alt="..." style={{height:"10rem" , width:"10rem"}}/>
          <div class="">
            <p class="">{ele.title}</p>
            <h5 class="">From -/{ele.price}</h5>
          </div>
      </div>
      ))}
      </Slider>
    </div>

    <div className='bg-light m-2' style={{height:"20rem"}}>
      <h3 className='ms-4 mt-3'>Baby Products & More </h3>
      <Slider {...settings}>
      {data.map((ele)=>(
      <div class="ms-4" style={{width:"20rem"}}>
        <img src={ele.image} class="" alt="..." style={{height:"10rem" , width:"10rem"}}/>
          <div class="">
            <p class="">{ele.title}</p>
            <h5 class="">From -/{ele.price}</h5>
          </div>
      </div>
      ))}
      </Slider>
    </div>

    <div className='bg-light m-2' style={{height:"20rem"}}>
      <h3 className='ms-4 mt-3'>Baby Products & More </h3>
      <Slider {...settings}>
      {data.map((ele)=>(
      <div class="ms-4" style={{width:"20rem"}}>
        <img src={ele.image} class="" alt="..." style={{height:"10rem" , width:"10rem"}}/>
          <div class="">
            <p class="">{ele.title}</p>
            <h5 class="">From -/{ele.price}</h5>
          </div>
      </div>
      ))}
      </Slider>
    </div>
    </>
  )
}

export default Products

const data = [{
  title:"Baby product",
  image:"media/headerImg/img7.png",
  price:"800"
},{
  title:"Baby product",
  image:"media/headerImg/img7.png",
  price:"800"
},{
  title:"Baby product",
  image:"media/headerImg/img7.png",
  price:"800"
},{
  title:"Baby product",
  image:"media/headerImg/img7.png",
  price:"800"
},{
  title:"Baby product",
  image:"media/headerImg/img7.png",
  price:"800"
},{
  title:"Baby product",
  image:"media/headerImg/img7.png",
  price:"800"
},{
  title:"Baby product",
  image:"media/headerImg/img7.png",
  price:"800"
},{
  title:"Baby product",
  image:"media/headerImg/img7.png",
  price:"800"
},{
  title:"Baby product",
  image:"media/headerImg/img7.png",
  price:"800"
},{
  title:"Baby product",
  image:"media/headerImg/img7.png",
  price:"800"
},{
  title:"Baby product",
  image:"media/headerImg/img7.png",
  price:"800"
},{
  title:"Baby product",
  image:"media/headerImg/img7.png",
  price:"800"
}]
