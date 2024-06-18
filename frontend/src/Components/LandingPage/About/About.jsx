import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="p-4 mr-20 ml-20 mb-[90px] rounded-[20px] mt-[160px] flex flex-col justify-center items-center BG-image">
      <p className="text-white text-3xl text-center mb-[10px] mt-[30px]">
        Meet the team behind the platform
      </p>
      <div className="flex flex-wrap w-auto h-auto gap-12 mt-10 mb-5">
        <a
          href="https://www.linkedin.com/in/mohammad-aqib-687ab5263/"
          className="text-[22px]"
          target="_blank"
        >
          <div
            className="circle items-center justify-center bg-sky-500"
            style={{
              background:
                "url(https://i.pinimg.com/236x/a7/fc/12/a7fc121134320e11efa0d989b93c7a42.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <p className=" text-center text-gray-200 mt-3">Aqib</p>
        </a>
        <a
          href="https://www.linkedin.com/in/kishan-salvi/"
          className="text-[22px]"
          target="_blank"
        >
          <div
            className="circle items-center justify-center bg-sky-500"
            style={{
              background:
                "url(https://i.pinimg.com/236x/31/ca/cf/31cacfc8bceb2011c2f23ea32d2fbfa1.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <p className=" text-center text-gray-200 mt-3">Kishh</p>
        </a>
        <a
          href="https://www.linkedin.com/in/tejas-joshi-6a9a7725a/"
          className="text-[22px]"
          target="_blank"
        >
          <div
            className="circle items-center justify-center bg-sky-500"
            style={{
              background:
                "url(https://i.pinimg.com/474x/8d/12/49/8d1249009c78480d4f773714179f8d8f.jpg )",
              // backgroundSize: "cover",
              // backgroundPosition: "center",
            }}
          ></div>
          <p className=" text-center text-gray-200 mt-3">Tejas</p>
        </a>
        <a
          href="https://www.linkedin.com/in/manveer-singh-147292220"
          className="text-[22px]"
          target="_blank"
        >
          <div
            className="circle items-center justify-center bg-sky-500"
            style={{
              background:
                "url(https://i.pinimg.com/236x/41/ab/c9/41abc9068413410b9e8aa37fa4bd20ae.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <p className=" text-center text-gray-200 mt-3">Manveer</p>
        </a>
        <a className="text-[22px]" target="_blank">
          <div
            className="circle items-center justify-center bg-sky-500"
            style={{
              background:
                "url(https://i.pinimg.com/236x/38/3d/f4/383df4e9b4d7c8b140e08c28372275bd.jpg)",
              // backgroundSize: "cover",
              // backgroundPosition: "center",
            }}
          ></div>
          <p className=" text-center text-gray-200 mt-3">Ajay</p>
        </a>
      </div>
    </div>
  );
};

export default About;
