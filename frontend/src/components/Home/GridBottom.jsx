import React from 'react';
import ArrowCircleRightSharpIcon from '@mui/icons-material/ArrowCircleRightSharp';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import './GridBottom.css'; // We'll create this CSS file

export default function GridBottom() {
    return (
        <div className="grid-bottom-card">
            <div className="card-image-container">
                <img
                    src="/media/sliderImg/img2.png"
                    alt="AI Health Advisor"
                    className="card-image"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/media/placeholder-health.jpg';
                    }}
                />
                <div className="image-overlay"></div>
            </div>
            
            <div className="card-content">
                <h3 className="card-title">AI Health Advisor</h3>
                <p className="card-description">Get personalized health recommendations from our AI-powered system</p>
                
                <Link to="/aiAdvisor" className="card-link">
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ArrowCircleRightSharpIcon />}
                        className="card-button"
                        sx={{
                            mt: 2,
                            px: 4,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: '600',
                            borderRadius: '50px',
                            textTransform: 'none',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-3px)',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                            }
                        }}
                    >
                        Consult Now
                    </Button>
                </Link>
            </div>
        </div>
    );
}