import React from 'react';
import './About.css'

const About = () => {
  return (
    <div className="p-4 mr-20 ml-20 mb-4 rounded-[20px] flex flex-col justify-center items-center BG-image">
      <p className="text-white text-4xl text-center mb-[30px] mt-[30px]">
        Meet the team behind the platform
      </p>
      <div className='flex flex-wrap w-auto h-auto gap-8 mt-10'>
        <div className='circle items-center justify-center bg-sky-400'>C1</div>
        <div className='circle items-center justify-center bg-sky-400'>C1</div>
        <div className='circle items-center justify-center bg-sky-400'>C1</div>
        <div className='circle items-center justify-center bg-sky-400'>C1</div>
        <div className='circle items-center justify-center bg-sky-400'>C1</div>
      </div>
    </div>
  )
}

export default About