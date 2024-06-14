import React from "react";
import connect from "../../../assets/Connect.png";
const Connect = () => {
  return (
    <div className="p-4 m-4 flex flex-col justify-center items-center bgImage">
      <p className="text-white text-6xl text-center">
        Find People around you and socialize in the same world
      </p>
      <img src={connect} alt="" className="w-full min-h-[50h]" />
    </div>
  );
};

export default Connect;
