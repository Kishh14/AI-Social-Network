import React from "react";
import "./Hero.css";
import L1 from "../../../assets/L1.png";
import Vector from "../../../assets/3d.png";
import Start from "../../../assets/Start.png";
import { useNavigate } from "react-router-dom";
import heroImg from '../../../assets/hero-image.png'

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-[80vh] justify-between bg-image">
      <div className="m-4 w-1/2 flex flex-col justify-center">
        <div className="h-auto w-2/3  mt-3 bg-gray-700 flex items-center rounded">
          <img src={L1} alt="image" className="h-12 w-12" />
          <p className="text-white text-xl">
            Use the power of AI in content creation
          </p>
        </div>
        <div className=" mt-5 h-auto w-3/4 flex">
          <p className="text-white text-5xl ">
            The Next <span className="text-sky-500">Generation</span> Social
            Media
          </p>

          <img
            src={Start}
            alt=""
            className="h-40 w-40 ml-52 mt-5 para cursor-pointer"
            onClick={() => navigate("/authentication")}
          />
        </div>
        <p className="text-white p-1 m-1 mt-5 w-3/4">
          Tired of the same old social media routine? Introducing a
          revolutionary platform that uses the power of AI to enhance your
          creativity and social experience.
        </p>
      </div>
      <div className="p-2 m-4 w-1/2 flex  justify-center">
        <img src={Vector} alt="" className="" />
      </div>
    </div>
  );
};

export default Hero;
