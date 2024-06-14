import React from "react";
import './Connect.css';
import connect from "../../../assets/connect.jpg";
const Connect = () => {
  return (
    <div className="p-4 m-4 flex flex-col justify-center items-center glassmorphism bg-Image">
      <p className="text-white text-6xl text-center m-2">
        Find People around you and socialize in the same world
      </p>
      <img src={connect} alt="" className="w-full min-h-[50h] rounded-[20px] m-2" />
    </div>
  );
};

export default Connect;
