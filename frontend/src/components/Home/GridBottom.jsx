import React from 'react';
import ArrowCircleRightSharpIcon from '@mui/icons-material/ArrowCircleRightSharp';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function GridBottom() {
  return (
    <>
        <div className="card bg-transparent" style={{ height: "26rem"}}>
          <img
            src="/media/sliderImg/img2.png"
            alt="ai-img"
           className="w-100"
          style={{objectFit:'cover'}}
          />
          <div className="card-img-overlay mt-5 ms-4">
            <h5 className="card-title" style={{color:"yellowgreen"}}>AI Advisor</h5>
            <Link to="/aiAdvisor" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ArrowCircleRightSharpIcon />}
                sx={{ mt: 2 }}
              >
                Consult Now
              </Button>
            </Link>
          </div>
        </div>
    </>
  );
}
