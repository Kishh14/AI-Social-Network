import React from "react";
import './Connect.css';
import connect from "../../../assets/connect.jpg";
const Connect = () => {
  return (
    <div className=" mb-[80px] mt-[80px]  flex flex-col justify-center items-center  bg-Image p-20">
      <p className="text-white text-4xl text-center  p-2 ">
        Find People around you and socialize in the same world
      </p>
      <div className="w-full mx-20 ">
        <img src={connect} alt="" className="rounded-[20px] mt-[100px]" />
      </div>
      
    </div>
  );
};

export default Connect;
