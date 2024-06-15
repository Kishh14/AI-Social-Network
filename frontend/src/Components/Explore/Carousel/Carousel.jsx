import React, { useEffect, useRef, useState } from "react";
import "./Carousel.css";
import axios from 'axios';

const Carousel = () => {
  const carouselRef = useRef(null);
  const [top, setTop] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const resp = await axios.get(`${import.meta.env.VITE_API_USER_URL}/allPosts`);
        let topPost = resp.data.posts;
        topPost = topPost.filter(post=>post.isMedia===true&&post.video===null)
        setTop(topPost);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
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
  }, [top]);

  return (
    <div className="carousel-container w-auto p-4 mt-3">
      <div className="carousel" ref={carouselRef}>
        {top.slice(0, 5).map((post, index) => (
          <div className="carousel__face" key={index}>
            <img
              src={post?.image}
              alt={`Post ${index}`}
              className="carousel__image w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
