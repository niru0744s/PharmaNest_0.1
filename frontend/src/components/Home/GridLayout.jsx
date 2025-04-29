import React from 'react'
import ArrowCircleRightSharpIcon from '@mui/icons-material/ArrowCircleRightSharp';

export default function GridLayout() {
    return (
        <>
            <div className='row m-2'>
                {/* first col */}
                <div className="col bg-light mx-1" style={{ height: "40rem" }}>
                    <div className='d-flex justify-content-evenly'>
                    <h3 className='mt-3'>Test Kits</h3>
                    <ArrowCircleRightSharpIcon className='mt-4 ms-5' />
                    </div>
                    <div className="row mt-5">
                        <div className="col">
                            <div class="">
                                <img src="media/headerImg/img7.png" class="" alt="..." style={{ height: "10rem", width: "10rem" }} />
                                <div class="">
                                    <p class="">Baby product</p>
                                    <h5 class="">From -/800</h5>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                        <div class="">
                                <img src="media/headerImg/img7.png" class="" alt="..." style={{ height: "10rem", width: "10rem" }} />
                                <div class="">
                                    <p class="">Baby product</p>
                                    <h5 class="">From -/800</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-5">
                    <div className="col">
                            <div class="">
                                <img src="media/headerImg/img7.png" class="" alt="..." style={{ height: "10rem", width: "10rem" }} />
                                <div class="">
                                    <p class="">Baby product</p>
                                    <h5 class="">From -/800</h5>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                        <div class="">
                                <img src="media/headerImg/img7.png" class="" alt="..." style={{ height: "10rem", width: "10rem" }} />
                                <div class="">
                                    <p class="">Baby product</p>
                                    <h5 class="">From -/800</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* second col */}
                <div className="col bg-light mx-1" style={{ height: "40rem" }}>
                <div className='d-flex justify-content-evenly'>
                    <h3 className='mt-3'>Test Kits</h3>
                    <ArrowCircleRightSharpIcon className='mt-4 ms-5' />
                    </div>
                    <div className="row mt-5">
                        <div className="col">
                        <div class="">
                                <img src="media/headerImg/img7.png" class="" alt="..." style={{ height: "10rem", width: "10rem" }} />
                                <div class="">
                                    <p class="">Baby product</p>
                                    <h5 class="">From -/800</h5>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                        <div class="">
                                <img src="media/headerImg/img7.png" class="" alt="..." style={{ height: "10rem", width: "10rem" }} />
                                <div class="">
                                    <p class="">Baby product</p>
                                    <h5 class="">From -/800</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col">
                        <div class="">
                                <img src="media/headerImg/img7.png" class="" alt="..." style={{ height: "10rem", width: "10rem" }} />
                                <div class="">
                                    <p class="">Baby product</p>
                                    <h5 class="">From -/800</h5>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                        <div class="">
                                <img src="media/headerImg/img7.png" class="" alt="..." style={{ height: "10rem", width: "10rem" }} />
                                <div class="">
                                    <p class="">Baby product</p>
                                    <h5 class="">From -/800</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* third col */}
                <div className="col bg-light mx-1" style={{ height: "40rem" }}>
                    <div className='d-flex justify-content-evenly'>
                    <h3 className='mt-3'>Test Kits</h3>
                    <ArrowCircleRightSharpIcon className='mt-4 ms-5' />
                    </div>
                    <div className="row mt-5">
                        <div className="col">
                        <div class="">
                                <img src="media/headerImg/img7.png" class="" alt="..." style={{ height: "10rem", width: "10rem" }} />
                                <div class="">
                                    <p class="">Baby product</p>
                                    <h5 class="">From -/800</h5>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                        <div class="">
                                <img src="media/headerImg/img7.png" class="" alt="..." style={{ height: "10rem", width: "10rem" }} />
                                <div class="">
                                    <p class="">Baby product</p>
                                    <h5 class="">From -/800</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col">
                        <div class="">
                                <img src="media/headerImg/img7.png" class="" alt="..." style={{ height: "10rem", width: "10rem" }} />
                                <div class="">
                                    <p class="">Baby product</p>
                                    <h5 class="">From -/800</h5>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                        <div class="">
                                <img src="media/headerImg/img7.png" class="" alt="..." style={{ height: "10rem", width: "10rem" }} />
                                <div class="">
                                    <p class="">Baby product</p>
                                    <h5 class="">From -/800</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

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
