import React, { useEffect, useRef } from "react";
import "./Carousel.css";
import image from '../../../assets/post.jpg';

const Carousel = () => {
  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;

    const handleMouseEnterImage = (event) => {
      const image = event.target;
      image.style.transform = "scale(1.2)"; // Scale up the image on hover
      image.style.transition = "transform 0.3s ease";
    };

    const handleMouseLeaveImage = (event) => {
      const image = event.target;
      image.style.transform = "scale(1)"; // Reset image scale on leave
    };

    const carouselImages = document.querySelectorAll(".carousel__image");
    carouselImages.forEach((image) => {
      image.addEventListener("mouseenter", handleMouseEnterImage);
      image.addEventListener("mouseleave", handleMouseLeaveImage);
    });

    return () => {
      carouselImages.forEach((image) => {
        image.removeEventListener("mouseenter", handleMouseEnterImage);
        image.removeEventListener("mouseleave", handleMouseLeaveImage);
      });
    };
  }, []);

  return (
    <div className="carousel-container w-auto p-4 mt-3">
      <div className="carousel" ref={carouselRef}>
        <div className="carousel__face">
          <img
            src="https://i.pinimg.com/564x/33/e1/cc/33e1cc97ea4cf9f119e5873def4658a7.jpg"
            alt="1"
            className="carousel__image w-full h-full object-cover"
          />
        </div>
        <div className="carousel__face">
          <img
            src=""
            alt="2"
            className="carousel__image w-full h-full object-cover"
          />
        </div>
        <div className="carousel__face">
          <img
            src={image}
            alt="3"
            className="carousel__image w-full h-full object-cover"
          />
        </div>
        <div className="carousel__face">
          <img
            src="https://i.pinimg.com/564x/33/e1/cc/33e1cc97ea4cf9f119e5873def4658a7.jpg"
            alt="4"
            className="carousel__image w-full h-full object-cover"
          />
        </div>
        <div className="carousel__face">
          <img
            src="https://i.pinimg.com/564x/33/e1/cc/33e1cc97ea4cf9f119e5873def4658a7.jpg"
            alt="5"
            className="carousel__image w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Carousel;
