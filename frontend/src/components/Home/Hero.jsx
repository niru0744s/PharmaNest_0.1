import React from 'react'

const Hero = () => {
  return (
    <div className='m-2 my-3 overflow-hidden'>
      <div className='row'>
        <div className='col-8'>
          <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
              <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img src="media/sliderImg/img1.png" class="d-block w-100 " alt="..." style={{ height: "30rem" }} />
                <div class="carousel-caption d-none d-md-block">
                  <h5>First slide label</h5>
                  <p>Some representative placeholder content for the first slide.</p>
                </div>
              </div>
              <div class="carousel-item">
                <img src="media/sliderImg/img2.png" class="d-block w-100 " alt="..." style={{ height: "30rem" }} />
                <div class="carousel-caption d-none d-md-block">
                  <h5>Second slide label</h5>
                  <p>Some representative placeholder content for the second slide.</p>
                </div>
              </div>
              <div class="carousel-item">
                <img src="media/sliderImg/img3.png" class="d-block w-100 " alt="..." style={{ height: "30rem" }} />
                <div class="carousel-caption d-none d-md-block">
                  <h5>Third slide label</h5>
                  <p>Some representative placeholder content for the third slide.</p>
                </div>
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
        <div className="col bg-light">
          <div className="row">
          <div class="mt-5 col-6" style={{ height: "20rem"}} >
            <h3 className='card-title mt-3'>Products</h3>
            <img src="media/headerImg/img7.png" class="card-img-top product" alt="..." style={{height:"10rem" , width:"100%"}}/>
              <div class="card-body">
                <p class="card-text">Baby Products</p>
                <h5 class="card-title">From -/800</h5>
              </div>
          </div>
          <div class="mt-5 col-6" style={{ height: "20rem"}} >
            <h3 className='card-title mt-3'>Products</h3>
            <img src="media/headerImg/img6.png" class="card-img-top product" alt="..." style={{height:"10rem" , width:"100%"}}/>
              <div class="card-body">
                <p class="card-text  ">Health Supplements</p>
                <h5 class="card-title ">From -/800</h5>
              </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero

