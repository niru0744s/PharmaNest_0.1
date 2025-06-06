import React from 'react';
import ArrowCircleRightSharpIcon from '@mui/icons-material/ArrowCircleRightSharp';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function GridBottom() {
  return (
    <>
      <div className="row m-2">
        <div className="col card bg-transparent border-0" style={{ height: "40rem" }}>
          <img
            src="/media/sliderImg/img2.png"
            className="card-img"
            alt=""
            style={{ height: "100%", width: "100%" }}
          />
          <div className="card-img-overlay mt-5 ms-4">
            <h5 className="card-title">AI Advisor</h5>
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
      </div>
    </>
  );
}
