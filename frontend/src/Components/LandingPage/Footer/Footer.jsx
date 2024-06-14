import React from "react";
import { SlSocialTwitter } from "react-icons/sl";
import { SiLinkedin,SiInstagram, SiFacebook} from "react-icons/si";


const Footer = () => {
  return (
    <footer className="p-0 mb-0">
      <div className="flex flex-col">
        <div className=" h-[2px] bg-white opacity-10" />

        <div className="flex items-center justify-between flex-wrap gap-4">
          <h4 className="font-extrabold text-[14px] text-white">SocialMedia</h4>
          <p className="font-normal text-[14px] text-white opacity-50">
            Copyright © 2023 - 2024 SocialMedia. All rights reserved.
          </p>

          <div className="flex gap-4">
          <SlSocialTwitter className="w-[14px] h-[14px] object-contain cursor-pointer text-white"/>
          <SiLinkedin className="w-[14px] h-[14px] object-contain cursor-pointer text-white" />
          <SiInstagram className="w-[14px] h-[14px] object-contain cursor-pointer text-white" />
          <SiFacebook className="w-[14px] h-[14px] object-contain cursor-pointer text-white" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
