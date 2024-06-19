import React from "react";
import "./Connect.css";
import connect from "../../../assets/connect.jpg";
const Connect = () => {
  return (
    <div className="connect mb-[50px] mt-[160px] flex flex-col justify-center items-center  bg-Image p-20">
      <p className="text-white text-3xl text-center px-2">
        Find People around you and socialize in the same world
      </p>
      <div className="w-full mx-20 ">
        <img
          src={connect}
          alt=""
          className="rounded-[20px] mt-[100px] w-[90%] mx-auto block"
        />
      </div>
    </div>
  );
};

export default Connect;
