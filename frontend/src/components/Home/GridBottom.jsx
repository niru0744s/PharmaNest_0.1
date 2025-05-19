import React from 'react'
import ArrowCircleRightSharpIcon from '@mui/icons-material/ArrowCircleRightSharp';
export default function GridBottom() {
    return (
        <>
            <div className="row m-2">
                <div className="col card bg-transparent border-0" style={{ height: "40rem" }}>
                    <img src="media/sliderImg/img2.png" className='card-img' alt="" style={{ height: "100%", width: "100%" }} />
                    <div class="card-img-overlay mt-5 ms-4">
                        <h5 class="card-title">AI Advisor</h5>
                        <button className='btn btn-outline-primary align-self-start mt-5'>Consult Now <ArrowCircleRightSharpIcon/></button>
                    </div>
                </div>
            </div>
        </>
    )
}
