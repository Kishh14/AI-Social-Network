import React from "react";
import "./Features.css";

const Features = () => {
  return (
    <div className="p-4 flex flex-col  justify-center items-center overflow-hidden BGImage mt-[210px]">
      <p className="text-white text-3xl text-center mb-5">
        Wanna know, what makes us stand apart?
      </p>
      <div className="flex gap-2 mt-[50px]  min-h-[50h] media">
        <div className="card min-w-[190px] h-[500px] justify-center items-center rounded-[24px]">
          <h3
            className="txt font-semibold sm:text-[26px] text-[18px] text-white absolute z-0 lg:bottom-20 lg:rotate-[-90deg] lg:origin-[0,0] mb-5 "
            style={{ whiteSpace: "nowrap" }}
          >
            Image Generation
          </h3>

          <div className="hide absolute bottom-0 p-8 flex  justify-start w-full flex-col bg-[rgba(0,0,0,0.5)] rounded-b-[24px] glassmorphism">
            <h2 className="m-3 font-eudoxus font-semibold sm:text-[32px] text-[24px] text-white">
              Image Generation
            </h2>
          </div>
        </div>
        <div className="card min-w-[190px] h-[500px] justify-center items-center rounded-[24px]">
          <h3
            className="txt font-semibold sm:text-[26px] text-[18px] text-white absolute z-0 lg:bottom-20 lg:rotate-[-90deg] lg:origin-[0,0] mb-5"
            style={{ whiteSpace: "nowrap" }}
          >
            Video Generation
          </h3>

          <div className="hide absolute bottom-0 p-8 flex justify-start w-full flex-col bg-[rgba(0,0,0,0.5)] rounded-b-[24px] glassmorphism">
            <h2 className="m-3 font-eudoxus font-semibold sm:text-[32px] text-[24px] text-white">
              Video Generation
            </h2>
          </div>
        </div>
        <div className="card min-w-[190px] h-[500px] justify-center items-center rounded-[24px]">
          <h3
            className="txt font-semibold sm:text-[26px] text-[18px] text-white absolute z-0 lg:bottom-20 lg:rotate-[-90deg] lg:origin-[0,0] mb-5"
            style={{ whiteSpace: "nowrap" }}
          >
            Caption Generation
          </h3>

          <div className="hide absolute bottom-0 p-8 flex justify-start w-full flex-col bg-[rgba(0,0,0,0.5)] rounded-b-[24px] glassmorphism">
            <h2 className="m-3 font-eudoxus font-semibold sm:text-[32px] text-[24px] text-white">
              Caption Generation
            </h2>
          </div>
        </div>
        <div className="card min-w-[190px] h-[500px] justify-center items-center rounded-[24px]">
          <h3
            className=" txt font-semibold sm:text-[26px] text-[18px] text-white absolute z-0 lg:bottom-20 lg:rotate-[-90deg] lg:origin-[0,0] mb-5"
            style={{ whiteSpace: "nowrap" }}
          >
            Meme Generation
          </h3>

          <div className="hide absolute bottom-0 p-8 flex justify-start w-full flex-col bg-[rgba(0,0,0,0.5)] rounded-b-[24px] glassmorphism">
            <h2 className="m-3 font-eudoxus font-semibold sm:text-[32px] text-[24px] text-white">
              Meme Generation
            </h2>
          </div>
        </div>
        <div className="card min-w-[190px] h-[500px] justify-center items-center rounded-[24px]">
          <h3
            className="txt font-semibold sm:text-[26px] text-[18px] text-white absolute z-0 lg:bottom-20 lg:rotate-[-90deg] lg:origin-[0,0] mb-5"
            style={{ whiteSpace: "nowrap" }}
          >
            And many more...
          </h3>

          <div className="hide absolute bottom-0 p-8 flex justify-start w-full flex-col bg-[rgba(0,0,0,0.5)] rounded-b-[24px] glassmorphism">
            <h2 className="m-3 font-eudoxus font-semibold sm:text-[32px] text-[24px] text-white">
              And many more...
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
