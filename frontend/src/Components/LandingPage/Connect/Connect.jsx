import React from "react";
import './Connect.css';
import connect from "../../../assets/connect.jpg";
const Connect = () => {
  return (
    <div className="m-4 mb-5 mt-2 flex flex-col justify-center items-center  bg-Image">
      <p className="text-white text-6xl text-center  p-2 mt-4 mb-4">
        Find People around you and socialize in the same world
      </p>
      <img src={connect} alt="" className="w-full min-h-[50h] rounded-[20px] m-2 " />
    </div>
  );
};

export default Connect;
