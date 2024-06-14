import React from "react";

import Hero from "./Hero/Hero";
import Features from "./Features/Features";
import "./LandingPage.css";
import Connect from "./Connect/Connect";
import About from "./About/About";
import Footer from './Footer/Footer'
import Header from "./Header/Header";

const LandingPage = () => {
  return (
    <div className="w-full h-screen overflow-hidden px-4 bg-black bgIMAGE ">
      <div className="mx-auto h-full overflow-y-scroll no-scrollbar ">
        <Header/>
        <Hero />
        <Features />
        <Connect />
        <About />
        <Footer/>
      </div>
    </div>
  );
};

export default LandingPage;
