import React from "react";
import './Footer.css';
import { SlSocialTwitter } from "react-icons/sl";
import { SiLinkedin, SiInstagram, SiFacebook } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="py-4 mb-0">
      <div className="flex flex-col">
        <div className="h-[1px] bg-white opacity-10" />

        <div className="ft flex items-center justify-between flex-wrap gap-4 px-[110px] pt-8">
          <h4 className="font-extrabold text-[22px] text-white">
            AI<span className="text-blue-500">Media</span>
          </h4>
          <p className="font-normal text-[16px] text-white opacity-50">
            Copyright ©2024 AIMedia. All rights reserved.
          </p>

          <div className="flex gap-4">
            <SlSocialTwitter className="w-[20px] h-[20px] object-contain cursor-pointer text-white" />
            <SiLinkedin className="w-[20px] h-[20px] object-contain cursor-pointer text-white" />
            <SiInstagram className="w-[20px] h-[20px] object-contain cursor-pointer text-white" />
            <SiFacebook className="w-[20px] h-[20px] object-contain cursor-pointer text-white" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
