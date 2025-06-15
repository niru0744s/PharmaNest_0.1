import { useState, useEffect } from 'react';
import './Carousel.css';
import GridBottom from './GridBottom'

const Hero = () => {
   const [activeIndex, setActiveIndex] = useState(0);
  
  const slides = [
    {
      image: "/media/sliderImg/img1.png",
      title: "Premium Healthcare Products",
      description: "Discover our curated collection of medical essentials",
      cta: "Shop Now"
    },
    {
      image: "/media/sliderImg/img2.png",
      title: "Trusted Medical Supplies",
      description: "Quality products for your health and wellness",
      cta: "Explore"
    },
    {
      image: "/media/sliderImg/img3.png",
      title: "24/7 Customer Support",
      description: "Our team is always ready to assist you",
      cta: "Contact Us"
    }
  ];

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  const goToPrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  return (
    <div className='m-2 my-3 overflow-hidden'>
      <div className='row'>
        <div className="col-lg-7">
      <div className="enhanced-carousel">
        <div className="carousel-inner">
          {slides.map((slide, index) => (
            <div 
              key={index}
              className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="carousel-overlay"></div>
              <div className="carousel-caption">
                <h3>{slide.title}</h3>
                <p>{slide.description}</p>
                <button className="carousel-cta">{slide.cta}</button>
              </div>
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={index === activeIndex ? 'active' : ''}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation arrows */}
        <button className="carousel-control prev" onClick={goToPrev}>
          <span className="carousel-control-icon">‹</span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control next" onClick={goToNext}>
          <span className="carousel-control-icon">›</span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
        <div className="col-lg-5">
          <GridBottom/>
        </div>
      </div>
    </div>
  )
}

export default Hero

